import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('auth');

const jwksUrl = 'https://dev-o3iexwjvu0zlzzyg.us.auth0.com/.well-known/jwks.json';

export async function handler(event) {
  let policyEffect = 'Deny';
  let principalId = 'user';

  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    if (jwtToken) {
      principalId = jwtToken.sub;
      policyEffect = 'Allow';
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message });
  }

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: policyEffect,
          Resource: '*',
        },
      ],
    },
  };
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader);
  const jwt = jsonwebtoken.decode(token, { complete: true });

  try {
    const res = await axios.get(jwksUrl);
    const key = res?.data?.keys?.find((k) => k.kid === jwt.header.kid);
    if (!key) {
      throw new Error('Key not found');
    }
    const pem = key.x5c[0];
    const cert = `-----BEGIN CERTIFICATE-----\n${pem}\n-----END CERTIFICATE-----`;
    return jsonwebtoken.verify(token, cert);
  } catch (error) {
    logger.error('Token verification failed', { error });
    throw new Error('Token validation error'); // Thêm thông báo lỗi cụ thể
  }
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header');

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header');
  }

  const split = authHeader.split(' ');
  return split[1]; // Trả về token
}
