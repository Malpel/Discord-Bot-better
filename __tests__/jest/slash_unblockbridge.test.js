const { execute } = require("../../src/discordBot/commands/faculty/unblockbridge");
const { editEphemeral, editErrorEphemeral, sendEphemeral } = require("../../src/discordBot/services/message");
const { findChannelFromDbByName } = require("../../src/discordBot/services/service");

const models = require("../mocks/mockModels");
jest.mock("../../src/discordBot/services/message");
jest.mock("../../src/discordBot/services/service");

const { defaultTeacherInteraction } = require("../mocks/mockInteraction");
const initalResponse = "Opening the bridge to Telegram...";
const channelModelInstanceMock = { save: jest.fn(), bridged: false };

findChannelFromDbByName
  .mockImplementation(() => ({ bridged: true }))
  .mockImplementationOnce(() => null)
  .mockImplementationOnce(() => channelModelInstanceMock);

afterEach(() => {
  jest.clearAllMocks();
});

describe("slash unblockbridge command", () => {
  test("Cannot use command on non-course channels", async () => {
    const client = defaultTeacherInteraction.client;
    const response = "command can only be performed on course channels!";
    await execute(defaultTeacherInteraction, client, models);
    expect(findChannelFromDbByName).toHaveBeenCalledTimes(1);
    expect(sendEphemeral).toHaveBeenCalledTimes(1);
    expect(sendEphemeral).toHaveBeenCalledWith(defaultTeacherInteraction, initalResponse);
    expect(editErrorEphemeral).toHaveBeenCalledTimes(1);
    expect(editErrorEphemeral).toHaveBeenCalledWith(defaultTeacherInteraction, response);
  });

  test("Blocked channel can be unblocked", async () => {
    const client = defaultTeacherInteraction.client;
    const response = "Messages from this channel will now on be sent to the bridged Telegram.";
    await execute(defaultTeacherInteraction, client, models);
    expect(findChannelFromDbByName).toHaveBeenCalledTimes(1);
    expect(sendEphemeral).toHaveBeenCalledTimes(1);
    expect(sendEphemeral).toHaveBeenCalledWith(defaultTeacherInteraction, initalResponse);
    expect(editEphemeral).toHaveBeenCalledTimes(1);
    expect(editEphemeral).toHaveBeenCalledWith(defaultTeacherInteraction, response);
  });

  test("Attempting to unblock a channel that has not been blocked responds with correct ephemeral", async () => {
    const client = defaultTeacherInteraction.client;
    const response = "This channel is already bridged.";
    await execute(defaultTeacherInteraction, client, models);
    expect(findChannelFromDbByName).toHaveBeenCalledTimes(1);
    expect(sendEphemeral).toHaveBeenCalledTimes(1);
    expect(sendEphemeral).toHaveBeenCalledWith(defaultTeacherInteraction, initalResponse);
    expect(editErrorEphemeral).toHaveBeenCalledTimes(1);
    expect(editErrorEphemeral).toHaveBeenCalledWith(defaultTeacherInteraction, response);
  });
});