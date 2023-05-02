# API3 Technical Documentation

The technical documentation is maintained by the core technical team. Please
feel free to create [issues](https://github.com/api3dao/vitepress-docs/issues)
for discussions, proposed, additions and changes. If you would like to
contribute directly please create a PR from a working branch.

<div style="color:red;">Please note that the VitePress documentation, though deployed,  is not production ready until Airnode <code>v1.0.0</code> is released.</div>

## VitePress

The technical documentation has moved from
[VuePress](https://vuepress.vuejs.org) `v1` to
[VitePress](https://vitepress.vuejs.org) `v1` beginning with the release of
Airnode `v1.0.0`.

## Running Locally

To run the documentation locally, you will need to run the following commands:

Install dependencies:

```bash
yarn install
```

Run the documentation locally:

```bash
yarn docs:dev
```

## Contributing

For creating a new page, you will need to create a folder in the
`/reference/oev/` directory. The folder name will be the name of the page.
Inside the folder, you will need to create an `index.md` file. The `index.md`
file will contain the content of the page. You will also need to update the
`sidebar.js` file in the `/reference/oev/` directory. The `sidebar.js` file
contains the sidebar navigation for the documentation.

## Deploy to AWS S3 bucket ([link](http://oev-docs.s3-website-us-east-1.amazonaws.com/))

**AWS Account**: `oev`

**Bucket**: `oev-docs`

To deploy the documentation to the AWS S3 bucket, you will need to run the:

> Note: You will need to have the [AWS CLI](https://aws.amazon.com/cli/)
> installed and AWS credentials configured.

```bash
yarn docs:build
aws s3 sync ./docs/.vitepress/dist/ s3://oev-docs
```
