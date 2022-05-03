# Locksmith

locksmith is the centralised jwt auth module for siliconminds

On startup of an app it should query us for the public key

## Data
### Users
- email
- password
- roles: {
  - application
  - roles
}
- tokenversion

### Apps
- roles

## Tokens
The access token is sent in an authorization header with the format: `JWT ${token}`.
It contains the userdata and permissions for an app. Thus it can be used to authorize access.

The refresh token is sent over in an http-only secure cookie, thats bound to the domain of locksmith.
It only contains just enough data to be able to request a new Access token, when it expires, or when 
talking to a diffrent app.

### Access token
- iss: issuer (domain)
- exp: expiry (expiry ms)
- aud: appid
- sub: subscriber (userid)
- userdata
- roles (for the appid)

### Refresh token
- iss: issuer (domain)
- exp: expiry (expiry ms)
- sub: subscriber (userid)

