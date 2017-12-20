# node-dynamic-dns

### Setup (Linux and macOS)
1. Clone into `/usr/local/src/node-dynamic-dns`
	- If you change this, make sure you also change:
	  - `ExecStart` in the `.service` for Linux
	  - The `Program` key in `com.oats.ddns.plist` for macOS
2. `npm install`
3. Change the shebang in `node-dynamic-dns.js` to point to the installed Node binary if required
3. Change `apiToken`, `domain` (should be the base domain), and `recordId` in `node-dynamic-dns.js` according to your DigitalOcean account

To find `recordId` (from DigitalOcean [Docs](https://developers.digitalocean.com/documentation/v2/#domain-records)):
> To get a listing of all records configured for a domain, send a GET request to `/v2/domains/$DOMAIN_NAME/records[?page=*]`.

Example:
```
Method: GET
Url: https://api.digitalocean.com/v2/domains/$DOMAIN_NAME/records?page=2
Content-Type: application/json
Authorization: Bearer b7d03a6947b217efb6f3ec3bd3504582
```
The authorization token is the same as the apiToken. It's a [DigitalOcean personal access token](https://www.digitalocean.com/community/tutorials/how-to-use-the-digitalocean-api-v2).

You can use https://www.hurl.it/ to easily construct a `GET` request.

##### Setting up the service (Linux)

4. Copy `node-dynamic-dns.service` to `/etc/systemd/system`
5. `sudo systemctl enable node-dynamic-dns`
6. `sudo service node-dynamic-dns start`

##### Setting up the service (macOS)

4. Copy `com.oats.ddns.plist` to `/Library/LaunchDaemons`
5. `sudo chown -R root /usr/local/src/node-dynamic-dns`
6. `sudo launchctl load /Library/LaunchDaemons/com.oats.ddns.plist`
