const axios = require("axios");
const gitLabRouter = require("./route/gitlab");
const healthRouter = require("./route/health");

const slackRouter = require("./route/slack");
const { app, receiver } = require("./route/bolt");

receiver.app.use("/gitlab", gitLabRouter);
receiver.app.use("/health", healthRouter);
receiver.app,use("/slack", slackRouter);

app.command("/wat", async ({ command, ack, say }) => {
  try {
    await ack();
    const GITLAB_PROJECT_ID = 8920796;
    const { data } = await axios.get(
      "https://gitlab.com/api/v4/projects/" +
        GITLAB_PROJECT_ID +
        "/merge_requests",
      {
        headers: {
          "PRIVATE-TOKEN": process.env.GITLAB_TOKEN,
        },
        params: {
          state: "opened",
          order_by: "updated_at",
        },
      }
    );
    console.log("OH YES: got data");

    data.forEach((mr) =>
      say({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `Open Merge Requests:\n*<${mr.web_url}|${mr.title}>*`,
            },
          },
          {
            type: "section",
            fields: [
              {
                type: "mrkdwn",
                text: "*Repository:*\nHelpful Stuff",
              },
              {
                type: "mrkdwn",
                text: `*Date Opened:*\n${mr.created_at}`,
              },
              {
                type: "mrkdwn",
                text: `*Last Updated:*\n${mr.updated_at}`,
              },
              {
                type: "mrkdwn",
                text: `*Assignee:*\n${mr.assignee}`,
              },
              {
                type: "mrkdwn",
                text: `*Has Conflicts:*\n${mr.has_conflicts}`,
              },
              {
                type: "mrkdwn",
                text: `*Blocking Discussions Resolved:*\n${mr.blocking_discussions_resolved}`,
              },
            ],
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "Approve",
                },
                style: "primary",
                value: "click_me_123",
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  emoji: true,
                  text: "View on Gitlab",
                },
                style: "danger",
                value: "click_me_123",
              },
            ],
          },
        ],
      })
    );
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

(async () => {
  const PORT = process.env.PORT || 3000;
  await app.start(PORT);
  console.log(`Slack Bot app is running on port ${PORT}`);
})();
