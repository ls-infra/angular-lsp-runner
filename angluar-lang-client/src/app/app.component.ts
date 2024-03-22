import { AfterViewInit, Component } from '@angular/core'; 
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
// this is required syntax highlighting
import '@codingame/monaco-vscode-groovy-default-extension';
import { startEditor } from 'monaco-languageclient-examples';
import { IDisposable } from 'monaco-editor';
import { UserConfig , MonacoEditorLanguageClientWrapper} from 'monaco-editor-wrapper';

import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';
 
useWorkerFactory({
  rootPath: window.location.href + '../..',
  basePath: '../assets',
});

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class MonacoEditorComponent  implements AfterViewInit{
  title = 'angluar-lang-client';
  
  private _subscription: IDisposable | null = null;
  async ngAfterViewInit(): Promise<void> {
 
    runGroovyClient();
}

handleOnTextChanged(){
  const  wrapper: MonacoEditorLanguageClientWrapper = new MonacoEditorLanguageClientWrapper();
  const model = wrapper.getModel();
  console.log('save click' , model)
  if (model) {
      const verifyModelContent = () => {
          const modelText = model.getValue();
       console.log(modelText)
      };

      this._subscription = model.onDidChangeContent(() => {
          verifyModelContent();
      });
      console.log(this._subscription)
      // do it initially
      verifyModelContent();
  }
}
}




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

