import { commands, window } from 'vscode';
import { NGA_LOGIN_COMMAND } from '../models';

export const execNgaLogin = () => {
  commands.executeCommand(NGA_LOGIN_COMMAND);
}

export const showInfoMessage = (message: string | number) => {
  window.showInformationMessage(`${message}`);
}

export const showErrorMessage = (message: string | number) => {
  window.showErrorMessage(`${message}`);
}