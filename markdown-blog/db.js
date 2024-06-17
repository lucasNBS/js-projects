const { PrismaClient } = require("@prisma/client");
const { default: slugify } = require("slugify");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const db = new PrismaClient().$extends({
  query: {
    article: {
      async create(data) {
        data.args.data = {
          ...data.args.data,
          slug: slugify(data.args.data.title, { lower: true, strict: true }),
          sanitizedHtml: dompurify.sanitize(
            marked.parse(data.args.data.markdown)
          ),
        };

        return data.query(data.args);
      },
      async update(data) {
        data.args.data = {
          ...data.args.data,
          slug: slugify(data.args.data.title, { lower: true, strict: true }),
          sanitizedHtml: dompurify.sanitize(
            marked.parse(data.args.data.markdown)
          ),
        };

        return data.query(data.args);
      },
    },
  },
});

module.exports = db;
