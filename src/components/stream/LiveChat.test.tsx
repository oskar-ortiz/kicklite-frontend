import { render, screen, fireEvent } from "@testing-library/react";
import LiveChat from "./LiveChat";

const mockSendMessage = vi.fn();
const mockConnect = vi.fn();

vi.mock("../../context/ChatContext", () => ({
  useChat: () => ({
    messages: [],
    sendMessage: mockSendMessage,
    connectToRoom: mockConnect,
  }),
}));

const renderChat = () => render(<LiveChat streamId="123" />);

describe("LiveChat Component", () => {
  beforeEach(() => {
    mockSendMessage.mockClear();
    mockConnect.mockClear();
  });

  test("renders chat input and send button", () => {
    renderChat();
    expect(screen.getByLabelText("chat-input")).toBeInTheDocument();
    expect(screen.getByLabelText("send-message")).toBeInTheDocument();
  });

  test("allows sending messages", () => {
    renderChat();
    const input = screen.getByLabelText("chat-input");
    const send = screen.getByLabelText("send-message");

    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(send);

    expect(mockSendMessage).toHaveBeenCalledWith("123", "Hello!", "You");
    expect(input).toHaveValue("");
  });

  test("clears input after sending message", () => {
    renderChat();
    const input = screen.getByLabelText("chat-input");
    const send = screen.getByLabelText("send-message");

    fireEvent.change(input, { target: { value: "Test msg" } });
    fireEvent.click(send);

    expect(input).toHaveValue("");
  });

  test("opens and closes emoji picker", () => {
    renderChat();
    const btn = screen.getByLabelText("toggle-emoji-picker");

    fireEvent.click(btn);
    expect(screen.getByLabelText("emoji-😀")).toBeInTheDocument();

    fireEvent.click(btn);
    expect(screen.queryByLabelText("emoji-😀")).not.toBeInTheDocument();
  });

  test("appends emoji to input", () => {
    renderChat();
    const btn = screen.getByLabelText("toggle-emoji-picker");
    fireEvent.click(btn);

    const emoji = screen.getByLabelText("emoji-😀");
    const input = screen.getByLabelText("chat-input");

    fireEvent.click(emoji);

    expect(input).toHaveValue("😀");
  });

  test("does not send whitespace-only messages", () => {
    renderChat();
    const input = screen.getByLabelText("chat-input");
    const send = screen.getByLabelText("send-message");

    fireEvent.change(input, { target: { value: "   " } });

    expect(send).toBeDisabled();
  });
});
