import { render, screen, fireEvent } from '@testing-library/react';
import LiveChat from './LiveChat';

describe("LiveChat", () => {

  test("renders the chat interface", () => {
    render(<LiveChat />);

    expect(screen.getByText("Chatting")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "chat-input" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "send-message" })).toBeInTheDocument();
  });

  test("allows sending messages", () => {
    render(<LiveChat />);
    const input = screen.getByRole("textbox", { name: "chat-input" });
    const sendButton = screen.getByRole("button", { name: "send-message" });

    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(sendButton);

    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  test("clears input after sending a valid message", () => {
    render(<LiveChat />);
    const input = screen.getByRole("textbox", { name: "chat-input" });
    const sendButton = screen.getByRole("button", { name: "send-message" });

    fireEvent.change(input, { target: { value: "This will be sent" } });
    fireEvent.click(sendButton);

    expect(input).toHaveValue("");
    expect(screen.getByText("This will be sent")).toBeInTheDocument();
  });

  test("opens and closes emoji picker", async () => {
    render(<LiveChat />);
    const emojiBtn = screen.getByRole("button", { name: "toggle-emoji-picker" });

    fireEvent.click(emojiBtn);

    const emoji = await screen.findByText((t) => t.trim() === "😀");
    expect(emoji).toBeInTheDocument();

    fireEvent.click(emojiBtn);
    expect(screen.queryByText((t) => t.trim() === "😀")).not.toBeInTheDocument();
  });

  test("appends emoji to input", async () => {
    render(<LiveChat />);
    const emojiBtn = screen.getByRole("button", { name: "toggle-emoji-picker" });

    fireEvent.click(emojiBtn);

    const emoji = await screen.findByText((t) => t.trim() === "😀");
    const input = screen.getByRole("textbox", { name: "chat-input" });

    fireEvent.click(emoji);

    expect(input).toHaveValue("😀");
  });

  test("does not send whitespace-only messages", () => {
    render(<LiveChat />);
    const input = screen.getByRole("textbox", { name: "chat-input" });
    const sendButton = screen.getByRole("button", { name: "send-message" });

    fireEvent.change(input, { target: { value: "   " } });

    expect(sendButton).toBeDisabled();
  });

});
