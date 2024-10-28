import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJHjzyxqD8gXkDMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi12aXN4dGpzejV6NXEzdm91LnVzLmF1dGgwLmNvbTAeFw0yNDEwMjcx
NTA3MDlaFw0zODA3MDYxNTA3MDlaMCwxKjAoBgNVBAMTIWRldi12aXN4dGpzejV6
NXEzdm91LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAJllpXPPgI11iVhnlFD/Zk0UIqxD60tUgzsGTDMuiMBckbzQcFB4autFxbkx
4ZD2CiVnTZmimuOqN558I3zLT9KtdbmDc1raHWfCmagaUdPCWm0RXtwqg92qBgUQ
HG7p6dknzNlUVHfBh79QYBo78biwslFvTKwt9jYfNr4CdacX0wt/KCgg4bV56thK
JoKy8S2K7/XV7xXZtcTyIpu3AUwXTAhPsQgfc0+oKKSMsaANk4ay5oQQzJ4ziiUk
DlkuIQetkggn5Al7bpIMK1Oi7ToknKpbkBHTt7+piOByil1XR9bXjusxb/caZJYz
vk5ekWppmtPmdP/1ky8+MQgpipkCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUHH0iBipdyE8WYxDwCPV2fwyA/rAwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBebBVxG7k1fKNXX2KyYstc6QA+mRsBgx2ufsIU7vP1
l+8x2T4659hGDgKH9l0zQ9lVe4lMbZp0t4MvB91mIyPVCWnQCKhqhGDZIDKJ5aCa
0DNQysuEwxgb8FPYVFQd4hc7vUqELgxjKfv2bJtqtovl8CqbcJhvxmZzNqV/GaKx
TbjFNxzKfI3HreXbgjqlh2uXM0ouden5+n/EEd5i3p2gxeNBLTEUsMKc0+cr+KPe
YI3GscBjLO/i3+ErDYTA8yWka8Qe/Ckoh8ha7LTK7I8kXW8PqIekFYpDFT8qDT9t
T29was2DXOrJzNDecdl5U8iC7Rsqk+WOViD3MMSui6Nd
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
   logger.info('JWT TOKEN', jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)

  // TODO: Implement token verification
  jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })

  const jwt = jsonwebtoken.decode(token, { complete: true })
  return jwt.payload
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
