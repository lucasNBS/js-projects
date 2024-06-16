const prisma = require("./prisma");
const io = require("socket.io")(8000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const DEFAULT_VALUE = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);

    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await prisma.document.update({
        where: { id: documentId },
        data: { data },
      });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await prisma.document.findUnique({ where: { id } });

  if (document) return document;

  return await prisma.document.create({
    data: { id: id, data: DEFAULT_VALUE },
  });
}
