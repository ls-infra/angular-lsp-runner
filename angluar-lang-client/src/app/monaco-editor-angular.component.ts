import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

// this is required syntax highlighting
import '@codingame/monaco-vscode-groovy-default-extension';
import * as monaco from 'monaco-editor';
import { 
  MonacoEditorLanguageClientWrapper,
} from 'monaco-editor-wrapper';
import { UserConfig } from 'monaco-editor-wrapper';
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';
useWorkerFactory({
  rootPath: window.location.href + '../..',
  basePath: '../assets',
});

@Component({
  selector: 'monaco-editor-angular',
template : `
<div>
    <div id="monaco-editor-root" class="monaco-editor"></div> 
</div>
`, 
styles : `
.monaco-editor {
  height: 50vh;
}
`
})
export class MonacoEditorAngularComponent implements AfterViewInit, OnDestroy {
  @Output () onTextChanged = new EventEmitter<string> ()
  @Input () userConfig : UserConfig; 
  title = 'angluar-lang-client';
  private wrapper: MonacoEditorLanguageClientWrapper =
    new MonacoEditorLanguageClientWrapper();
  private containerElement?: HTMLDivElement;
  private _subscription: monaco.IDisposable | null = null;
  private isRestarting?: Promise<void>;
  private started: (value: void | PromiseLike<void>) => void;

  async ngAfterViewInit(): Promise<void> {
    this.containerElement = document.getElementById(
      'monaco-editor-root'
    ) as HTMLDivElement;
    await this.handleReinit();
  }

  protected async handleReinit() {
    await this.destroyMonaco();
    await this.initMonaco();
    await this.startMonaco();
  }

  protected async destroyMonaco(): Promise<void> {
    if (this.wrapper) {
      if (this.isRestarting) {
        await this.isRestarting;
      }
      try {
        await this.wrapper.dispose();
      } catch {
        // The language client may throw an error during disposal.
        // This should not prevent us from continue working.
      }
    }
    if (this._subscription) {
      this._subscription.dispose();
    }
  }

  async ngOnDestroy() {
    this.destroyMonaco();
  }

  protected async initMonaco() {
    this.isRestarting = new Promise<void>((resolve) => {
      this.started = resolve;
  });
  await this.wrapper.init(this.userConfig);
  }

  protected async startMonaco() {
   

    if (this.containerElement) { 

        // exceptions are forwarded to onError callback or the exception is thrown
        try {
            await this.wrapper.start(this.containerElement);
        } catch (e) {
        
        }
        this.started();
        this.isRestarting = undefined;

     

        this.handleOnTextChanged();
    }
}

  handleOnTextChanged() {
    const model = this.wrapper.getModel();
    if (model) {
      const verifyModelContent = () => {
        const modelText = model.getValue();
         this.onTextChanged.emit(modelText)
      };

      this._subscription = model.onDidChangeContent(() => {
        verifyModelContent();
      });
      // do it initially
      verifyModelContent();
      console.log(this._subscription);
    }
  }
}



