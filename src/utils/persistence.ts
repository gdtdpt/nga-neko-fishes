import { ConfigurationTarget, ExtensionContext, workspace, } from 'vscode';

export class Persistence {
  private context: ExtensionContext;
  private static INSTANCE: Persistence;
  private constructor(context: ExtensionContext) {
    this.context = context;
  }
  static init(context: ExtensionContext) {
    this.INSTANCE = new Persistence(context);
  }
  static set cookie(cookie: string) {
    const cookieConfig = workspace.getConfiguration('nga');
    cookieConfig.update('cookie', cookie, ConfigurationTarget.Global);
  }
  static get cookie(): string {
    const cookieConfig = workspace.getConfiguration('nga');
    return cookieConfig.get<string>('cookie') || '';
  }
  static get context(): ExtensionContext {
    return this.INSTANCE.context;
  }
}