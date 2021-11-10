const { app } = require("./config/bolt");
const { TEST_PID } = require("./config/project-ids");
const { formatOpenMRBlock } = require("./formatter");
const { getMergeRequests } = require("./helpers/gitlab");

app.command("/open-mrs", async ({ command, ack, say }) => {
  try {
    await ack();
    const response = await getMergeRequests(TEST_PID);
    response.data.forEach((mr) => say(formatOpenMRBlock(mr)));
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});
