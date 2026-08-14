import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  GATE_HOME_PATH,
  GATE_INVALID_PASSWORD_MESSAGE,
  GATE_UNAVAILABLE_MESSAGE,
  GATE_UNLOCK_ENDPOINT,
  MAX_GATE_PASSWORD_LENGTH,
  UNLOCK_CTA,
  UNLOCK_LABEL,
} from "../../lib/gate";
import { UnlockForm } from "./unlock-form";

const PASSWORD = "press-preview-2026";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function jsonResponse(body: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
  } as Response;
}

function renderForm({
  next,
  response = jsonResponse({ next: GATE_HOME_PATH }),
}: {
  next?: string;
  response?: Response | Promise<Response>;
} = {}) {
  const fetchMock = vi.fn().mockReturnValue(Promise.resolve(response));
  const onUnlocked = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  render(<UnlockForm next={next} onUnlocked={onUnlocked} />);

  return { fetchMock, onUnlocked, user: userEvent.setup() };
}

async function submitPassword(
  user: ReturnType<typeof userEvent.setup>,
  password: string,
  { paste = false }: { paste?: boolean } = {},
) {
  if (password) {
    const field = screen.getByLabelText(UNLOCK_LABEL);

    if (paste) {
      // Keystroke-by-keystroke entry of a very long value is too slow here.
      await user.click(field);
      await user.paste(password);
    } else {
      await user.type(field, password);
    }
  }
  await user.click(screen.getByRole("button", { name: UNLOCK_CTA }));
}

function verifyUnlockRequest(fetchMock: ReturnType<typeof vi.fn>, next: string) {
  expect(fetchMock).toHaveBeenCalledTimes(1);
  const [url, init] = fetchMock.mock.calls[0]!;
  expect(url).toBe(GATE_UNLOCK_ENDPOINT);
  expect(init.method).toBe("POST");
  expect(JSON.parse(init.body)).toEqual({ password: PASSWORD, next });
}

async function verifyError(message: string) {
  const alert = await screen.findByRole("alert");
  expect(alert.textContent).toBe(message);
  expect(screen.getByLabelText(UNLOCK_LABEL).getAttribute("aria-invalid")).toBe(
    "true",
  );
}

function verifyNoError() {
  expect(screen.queryByRole("alert")).toBeNull();
}

describe("UnlockForm", () => {
  it("sends the password and follows the returned page", async () => {
    const { fetchMock, onUnlocked, user } = renderForm({
      next: "/press",
      response: jsonResponse({ next: "/press" }),
    });

    await submitPassword(user, PASSWORD);

    verifyUnlockRequest(fetchMock, "/press");
    await waitFor(() => expect(onUnlocked).toHaveBeenCalledWith("/press"));
    verifyNoError();
  });

  it("defaults to the home page when no page was requested", async () => {
    const { fetchMock, onUnlocked, user } = renderForm();

    await submitPassword(user, PASSWORD);

    verifyUnlockRequest(fetchMock, GATE_HOME_PATH);
    await waitFor(() => expect(onUnlocked).toHaveBeenCalledWith(GATE_HOME_PATH));
  });

  it("refuses an off-site redirect handed back by the server", async () => {
    const { onUnlocked, user } = renderForm({
      response: jsonResponse({ next: "https://evil.example.com" }),
    });

    await submitPassword(user, PASSWORD);

    await waitFor(() => expect(onUnlocked).toHaveBeenCalledWith(GATE_HOME_PATH));
  });

  it("shows the server message for a wrong password", async () => {
    const { onUnlocked, user } = renderForm({
      response: jsonResponse(
        { error: GATE_INVALID_PASSWORD_MESSAGE },
        false,
        401,
      ),
    });

    await submitPassword(user, PASSWORD);

    await verifyError(GATE_INVALID_PASSWORD_MESSAGE);
    expect(onUnlocked).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: UNLOCK_CTA }).hasAttribute("disabled"),
    ).toBe(false);
  });

  it("rejects an empty password before calling the server", async () => {
    const { fetchMock, onUnlocked, user } = renderForm();

    await submitPassword(user, "");

    await verifyError("Password is required");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onUnlocked).not.toHaveBeenCalled();
  });

  it("rejects an over-long password before calling the server", async () => {
    const { fetchMock, user } = renderForm();

    await submitPassword(user, "a".repeat(MAX_GATE_PASSWORD_LENGTH + 1), {
      paste: true,
    });

    await verifyError("Password is too long");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports an unreachable server", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
    const onUnlocked = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<UnlockForm onUnlocked={onUnlocked} />);

    await submitPassword(userEvent.setup(), PASSWORD);

    await verifyError(GATE_UNAVAILABLE_MESSAGE);
    expect(onUnlocked).not.toHaveBeenCalled();
  });

  it("reports a failure the server did not explain", async () => {
    const { user } = renderForm({
      response: jsonResponse({}, false, 500),
    });

    await submitPassword(user, PASSWORD);

    await verifyError(GATE_UNAVAILABLE_MESSAGE);
  });

  it("disables the button while the password is being checked", async () => {
    let release: (value: Response) => void = () => {};
    const pending = new Promise<Response>((resolve) => {
      release = resolve;
    });
    const { onUnlocked, user } = renderForm({ response: pending });

    await submitPassword(user, PASSWORD);

    const button = screen.getByRole("button", { name: UNLOCK_CTA });
    expect(button.hasAttribute("disabled")).toBe(true);

    release(jsonResponse({ next: GATE_HOME_PATH }));
    await waitFor(() => expect(onUnlocked).toHaveBeenCalled());
  });

  it("masks the password field", () => {
    renderForm();
    const field = screen.getByLabelText(UNLOCK_LABEL);
    expect(field.getAttribute("type")).toBe("password");
    expect(field.getAttribute("autocomplete")).toBe("current-password");
  });
});
