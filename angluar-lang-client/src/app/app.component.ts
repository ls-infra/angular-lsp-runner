import { Component } from '@angular/core';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import { UserConfig } from 'monaco-editor-wrapper';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  text = '';

  userConfig: UserConfig = {
    wrapperConfig: {
      serviceConfig: {
        userServices: {
          ...getKeybindingsServiceOverride(),
        },
        debugLogging: true,
      },
      editorAppConfig: {
        $type: 'extended',
        languageId: 'groovy',
        code,
        useDiffEditor: false,
        userConfiguration: {
          json: JSON.stringify({
            'workbench.colorTheme': 'Default Dark Modern',
            'editor.guides.bracketPairsHorizontal': 'active',
          }),
        },
      },
    },
    languageClientConfig: {
      options: {
        $type: 'WebSocketUrl',
        url: `ws://localhost:${groovyConfig.port}${groovyConfig.path}`,
      },
    },
  };

  onTextChanged(text: string) {
    this.text = text;
  }
}
const code = `package test.org;
import java.io.File ;
File file = new File("E:/Example.txt");
`;

export const groovyConfig = {
  port: 30002,
  path: '/groovy',
};
