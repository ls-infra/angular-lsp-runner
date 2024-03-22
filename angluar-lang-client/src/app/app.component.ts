import { AfterViewInit, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
// this is required syntax highlighting
import '@codingame/monaco-vscode-groovy-default-extension';
import { startEditor } from 'monaco-languageclient-examples';

import { UserConfig } from 'monaco-editor-wrapper';

import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements AfterViewInit{
  title = 'angluar-lang-client';

  async ngAfterViewInit(): Promise<void> {
    configureMonacoWorkers();
    runGroovyClient();
}
}


export const configureMonacoWorkers = () => {
  useWorkerFactory({
      basePath: '../../../node_modules'
  });
};

const code = `package test.org;
import java.io.File ;
File file = new File("E:/Example.txt");
`;

export const groovyConfig = {
  port: 30002,
  path: '/groovy'
};

const userConfig: UserConfig = {
  wrapperConfig: {
      serviceConfig: {
          userServices: {
              ...getKeybindingsServiceOverride(),
          },
          debugLogging: true
      },
      editorAppConfig: {
          $type: 'extended',
          languageId: 'groovy',
          code,
          useDiffEditor: false,
          userConfiguration: {
              json: JSON.stringify({
                  'workbench.colorTheme': 'Default Dark Modern',
                  'editor.guides.bracketPairsHorizontal': 'active'
              })
          }
      }
  },
  languageClientConfig: {
      options: {
          $type: 'WebSocketUrl',
          url: `ws://localhost:${groovyConfig.port}${groovyConfig.path}`
      }
  }
};

export const runGroovyClient = () => {
  try {
      const htmlElement = document.getElementById('monaco-editor-root');

         startEditor(userConfig, htmlElement, code);

  } catch (e) {
      console.error(e);
  }
};

