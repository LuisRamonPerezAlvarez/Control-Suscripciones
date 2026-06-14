import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import pool from '../config/database';
import crypto from 'crypto';

interface LoginBody {
  username: string;
  password: string;
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body as LoginBody;
    if (!username?.trim() || !password) {
      res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
      return;
    }

    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT id, password_hash
       FROM usuarios
       WHERE username = ? LIMIT 1`,
      [username.trim()]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const user = rows[0];
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    if (passwordHash !== String(user.password_hash)) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 horas

    await pool.query(
      'UPDATE usuarios SET last_login = ? WHERE id = ?',
      [new Date(), user.id],
    );

    await pool.query(
      'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expiresAt],
    );

    res.json({ token, username: username.trim() });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

interface RegisterBody {
  username: string;
  password: string;
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body as RegisterBody;

    if (!username?.trim() || !password) {
      res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
      return;
    }

    const trimmedUsername = username.trim();
    const [existingUsers] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT id FROM usuarios WHERE username = ? LIMIT 1`,
      [trimmedUsername],
    );

    if (existingUsers.length > 0) {
      res.status(409).json({ error: 'El nombre de usuario ya está en uso' });
      return;
    }

    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
    const [result] = await pool.query<mysql.ResultSetHeader>(
      'INSERT INTO usuarios (username, password_hash) VALUES (?, ?)',
      [trimmedUsername, passwordHash],
    );

    const userId = result.insertId;
    res.status(201).json({ message: 'Usuario creado exitosamente', username: trimmedUsername });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
}
