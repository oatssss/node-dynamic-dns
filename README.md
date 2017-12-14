# node-dynamic-dns

### Setup (Linux)
1. Clone into `/usr/local/src/node-dynamic-dns`
2. `npm install`
3. Change `apiToken`, `domain`, and `recordId` in `node-dynamic-dns.js` according to your DigitalOcean account

To find `recordId` (from DigitalOcean Docs):
> To get a listing of all records configured for a domain, send a GET request to /v2/domains/$DOMAIN_NAME/records.

Example:
```
Method: GET
Url: https://api.digitalocean.com/v2/domains/$DOMAIN_NAME/records
Content-Type: application/json
Authorization: Bearer b7d03a6947b217efb6f3ec3bd3504582
```
The authorization token is a [DigitalOcean personal access token](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2).

You can use https://www.hurl.it/ to easily construct a `GET` request.

4. Copy `node-dynamic-dns.service` to `/etc/systemd/system`
5. `sudo systemctl enable node-dynamic-dns`
6. `sudo service node-dynamic-dns start`
