import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { ResultSetHeader } from 'mysql2'
import { v4 as uuidv4 } from 'uuid'
import config from '../config.json' with { type: 'json' }
import pool from '../pool'

export async function Register(req: Request, res: Response) {
  try {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(req.body.password, salt)

    await pool.query<ResultSetHeader>(
      'INSERT INTO Users (Username, Password) VALUES (?, ?);',
      [req.body.username, passwordHash]
    )

    const [rows] = await pool.query<IUser[]>(
      'SELECT * FROM Users WHERE Username = ?;',
      req.body.username
    )

    const role = rows[0]!.Role
    const userData = {
      user_id: rows[0]!.Id,
      username: rows[0]!.Username,
      is_admin: role === 'Admin',
    }

    const accessToken = jwt.sign(
      {
        sub: userData.username,
        exp: Math.floor(Date.now() / 1000) + config.ACCESS_TOKEN_OPTIONS.exp,
        jti: uuidv4(),
        user: userData,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY!,
      {
        algorithm: 'HS256',
      }
    )

    const refreshToken = jwt.sign(
      {
        sub: userData.username,
        jti: uuidv4(),
        user: {
          user_id: userData.user_id,
        },
      },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY!,
      {
        algorithm: 'HS256',
      }
    )

    res.status(200).json({
      message: 'You have successfully registered',
      answer: {
        user_data: userData,
        refresh_token: {
          value: refreshToken,
          cookie_options: config.REFRESH_TOKEN_COOKIE_OPTIONS,
        },
        access_token: {
          value: accessToken,
        },
      },
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Server is not responding',
      answer: err,
    })
  }
}

export async function Login(req: Request, res: Response) {
  try {
    const [rows] = await pool.query<IUser[]>(
      'SELECT * FROM Users WHERE Username = ?;',
      [req.body.username]
    )

    if (!rows.length) {
      res.status(404).json({
        message: 'Your authorization credentials are incorrect',
        answer: null,
      })
      return
    }

    const passwordHash = rows[0]!.Password
    const isSame = await bcrypt.compare(req.body.password, passwordHash)
    if (!isSame) {
      res.status(400).json({
        message: 'Your authorization credentials are incorrect',
        answer: null,
      })
      return
    }

    const role = rows[0]!.Role
    const userData = {
      user_id: rows[0]!.Id,
      username: rows[0]!.Username,
      is_admin: role === 'Admin',
    }

    const accessToken = jwt.sign(
      {
        sub: userData.username,
        exp: Math.floor(Date.now() / 1000) + config.ACCESS_TOKEN_OPTIONS.exp,
        jti: uuidv4(),
        user: userData,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY!,
      {
        algorithm: 'HS256',
      }
    )

    const refreshToken = jwt.sign(
      {
        sub: userData.username,
        jti: uuidv4(),
        user: {
          user_id: userData.user_id,
        },
      },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY!,
      {
        algorithm: 'HS256',
      }
    )

    res.status(200).json({
      message: 'You have successfully registered',
      answer: {
        user_data: userData,
        refresh_token: {
          value: refreshToken,
          cookie_options: config.REFRESH_TOKEN_COOKIE_OPTIONS,
        },
        access_token: {
          value: accessToken,
        },
      },
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Server is not responding',
      answer: err,
    })
  }
}

export async function Refresh(req: IRequestRefreshToken, res: Response) {
  try {
    const [rows] = await pool.query<IUser[]>(
      'SELECT * FROM Users WHERE Id = ?;',
      req.user!.user_id
    )

    const role = rows[0]!.Role
    const userData = {
      user_id: rows[0]!.Id,
      username: rows[0]!.Username,
      is_admin: role === 'Admin',
    }

    const accessToken = jwt.sign(
      {
        sub: userData.username,
        exp: Math.floor(Date.now() / 1000) + config.ACCESS_TOKEN_OPTIONS.exp,
        jti: uuidv4(),
        user: userData,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET_KEY!,
      {
        algorithm: 'HS256',
      }
    )

    res.status(200).json({
      message: 'Your access token is successfully refreshed',
      answer: {
        access_token: {
          value: accessToken,
        },
      },
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      message: 'Server is not responding',
      answer: err,
    })
  }
}

// export function Logout(_: Request | undefined, res: Response) {
//   try {
//     res.clearCookie('user_data').clearCookie('token').status(200).json({
//       message: 'You have successfully logged out',
//       answer: true,
//     })
//   } catch (err) {
//     console.log(err)

//     res.status(500).json({
//       message: 'Server is not responding',
//       answer: err,
//     })
//   }
// }
