# github-webhook

GitHub webhook handler

## Run development server

`dev` command will run the lambda handler locally via `serverless-offline`.

```bash
yarn dev
```

Then, expose the local server to the internet via [ngrok](https://ngrok.com/).

```bash
ngrok http 4000
```

You can use the ngrok URL as a webhook URL for GitHub repositories, organizations, or apps.
