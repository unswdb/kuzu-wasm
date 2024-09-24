import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import kuzu_wasm from '@kuzu/kuzu-wasm';



const Shell = () => {
  let UI_debug = false;
  const terminalRef = useRef(null);
  const [term, setTerm] = useState(null);
  const [connection, setConnection] = useState(null);
  const fileInputRef = useRef();

  const handleFileSelect = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        var fileData = new Uint8Array(e.target.result); // transfer to Uint8Array
        var fileName = file.name; // get path from user
        var filePath = 'data/' + fileName;
        kuzu.FS.writeFile(filePath, fileData);
        console.log('File uploaded successfully!');
      };
      reader.readAsArrayBuffer(file);
    }
  }

  const keywordList = ["CALL", "CREATE", "DELETE", "DETACH", "EXISTS", "FOREACH", "LOAD", "MATCH", "MERGE", "OPTIONAL", "REMOVE", "RETURN", "SET", "START", "UNION", "UNWIND", "WITH", "LIMIT", "ORDER", "SKIP", "WHERE", "YIELD", "ASC", "ASCENDING", "ASSERT", "BY", "CSV", "DESC", "DESCENDING", "ON", "ALL", "CASE", "ELSE", "END", "THEN", "WHEN", "AND", "AS", "REL", "TABLE", "CONTAINS", "DISTINCT", "ENDS", "IN", "IS", "NOT", "OR", "STARTS", "XOR", "CONSTRAINT", "DROP", "EXISTS", "INDEX", "NODE", "KEY", "UNIQUE", "INDEX", "JOIN", "PERIODIC", "COMMIT", "SCAN", "USING", "FALSE", "NULL", "TRUE", "ADD", "DO", "FOR", "MANDATORY", "OF", "REQUIRE", "SCALAR", "EXPLAIN", "PROFILE", "HEADERS", "FROM", "FIELDTERMINATOR", "STAR", "MINUS", "COUNT", "PRIMARY", "COPY", "RDFGRAPH", "ALTER", "RENAME", "COMMENT", "MACRO", "GLOB", "COLUMN", "GROUP", "DEFAULT", "TO", "BEGIN", "TRANSACTION", "READ", "ONLY", "WRITE", "COMMIT_SKIP_CHECKPOINT", "ROLLBACK", "ROLLBACK_SKIP_CHECKPOINT", "INSTALL", "EXTENSION", "SHORTEST", "ATTACH", "IMPORT", "EXPORT", "USE"]
  const startHint = (kuzuTerm,dbVersion,storageVersion) => {
    kuzuTerm.writeln('Welcome to the Kuzu Shell!');
    kuzuTerm.writeln('Database: v'+dbVersion);
    kuzuTerm.writeln('Storage : v'+storageVersion);
    kuzuTerm.writeln('Package : @kuzu/kuzu-wasm');
    kuzuTerm.writeln('\n\rConnected to a local transient in-memory database.');
    kuzuTerm.writeln('Enter help for usage hints.\n\r');
  }

  const helpHint = (kuzuTerm) => {
    // kuzuTerm.write("\n\n\r")
    kuzuTerm.writeln('');
    kuzuTerm.writeln('');
    kuzuTerm.writeln('\x1b[1;33mCommands:\x1b[0m');
    kuzuTerm.writeln('clear                 Clear the shell.');
    kuzuTerm.writeln('ls                    List files in the data directory.');
    kuzuTerm.writeln('upload                Upload a file to the data directory.');
    kuzuTerm.writeln('examples              Example queries.');
    kuzuTerm.writeln('');
    kuzuTerm.writeln('Repositories:');
    kuzuTerm.writeln('\thttps://github.com/unswdb/kuzu-wasm');
  }

  const examplesHint = (kuzuTerm) => {

    kuzuTerm.write("\n\n\r")
    kuzuTerm.writeln('\x1b[1;33mExample queries:\x1b[0m');
    kuzuTerm.write("\n\r")
    kuzuTerm.writeln('# Create schema');
    kuzuTerm.writeln('CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))');
    kuzuTerm.writeln('CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))');
    kuzuTerm.writeln('CREATE REL TABLE Follows(FROM User TO User, since INT64)');
    kuzuTerm.writeln('CREATE REL TABLE LivesIn(FROM User TO City)');
    kuzuTerm.writeln('');
    kuzuTerm.writeln('#Insert data');
    kuzuTerm.writeln('COPY User FROM "/demo-db/csv/user.csv"');
    kuzuTerm.writeln('COPY City FROM "/demo-db/csv/city.csv"');
    kuzuTerm.writeln('COPY Follows FROM "/demo-db/csv/follows.csv"');
    kuzuTerm.writeln('COPY LivesIn FROM "/demo-db/csv/lives-in.csv"');
    kuzuTerm.writeln('');
    kuzuTerm.writeln('#Cypher query');
    kuzuTerm.writeln('MATCH (a:User)-[f:Follows]->(b:User)RETURN a.name, b.name, f.since');
  }

  const formatString = (inputString) => {
    // return inputString
    keywordList.forEach(keyword => {
      const color = "\x1b[1;36m"
      const pattern = new RegExp(`\\b${keyword}\\b`, "gi");
      inputString = inputString.replace(pattern, `${color}$&\x1b[0m`);
    });
    return inputString;
  }

  useEffect(() => {
    if (terminalRef.current && !term) {
      const kuzuTerm = new Terminal({
        cursorBlink: true,
        cursorStyle: 'block',
        fontSize: 14,
        fontFamily: 'monospace',
        theme: { background: '#333' },
      });
      const PROMPT = "kuzu# ";
      kuzuTerm.prompt = () => {
        kuzuTerm.write("\r\n" + PROMPT);
      };
      const fitAddon = new FitAddon();
      kuzuTerm.loadAddon(fitAddon);
      kuzuTerm.open(terminalRef.current);
      fitAddon.fit();

      setTerm(kuzuTerm);
      kuzuTerm.writeln('Starting kuzu...');
      var kuzu = null;
      let database = null;
      let connection = null;
      if (!UI_debug) {
        kuzu_wasm().then((module) => {
          kuzu = module;
          window.kuzu = kuzu
          kuzu.FS.mkdir("data")
          database = new module.WebDatabase("test", 0, 1, false, false, 4194304 * 16 * 4)
          connection = new module.WebConnection(database, 0)
          kuzuTerm.clear();
          const storageVersion = kuzu.WebDatabase.getStorageVersion();
          const dbVersion = kuzu.WebDatabase.getVersion();
          startHint(kuzuTerm,dbVersion,storageVersion);
          kuzuTerm.prompt();
        })
      } else { kuzuTerm.clear(); kuzuTerm.writeln('Welcome to the Kuzu Shell!'); }

      const getCurrentLineContent = (cursorY = kuzuTerm.buffer.active.cursorY + kuzuTerm.buffer.active.viewportY) => {
        if (cursorY < 1) return PROMPT;
        let command = kuzuTerm.buffer.active.getLine(cursorY).translateToString().trim();
        // console.log("cursorY",cursorY,"command","'"+command+"'")
        command = command.startsWith(PROMPT.trim())
          ? command.slice(PROMPT.length)
          : getCurrentLineContent(cursorY - 1) + ';' + command;
        return command;
      };

      kuzuTerm.attachCustomKeyEventHandler((arg) => {
        if ((arg.ctrlKey || arg.metaKey) && arg.code === "KeyV" && arg.type === "keydown") {
          if (UI_debug) console.log(arg)
          navigator.clipboard.readText()
            .then(text => {
              text = formatString(text);
              kuzuTerm.write(text.replace(/\r?\n/g, '\r\n'));
            })
        } else if (arg.ctrlKey && arg.code === "KeyC" && arg.type === "keydown") {
          kuzuTerm.prompt();
        }
        return true;
      });
      const executeCommand = (commands) => {
        // console.log(commands.split(';'))
        // return
        try {
          let commandList = commands.split(';');
          commandList.forEach((cmd) => {
            cmd = cmd.trim();
            // console.log("exec:",cmd);
            if (cmd != '') {
              if (cmd.startsWith('#') || cmd.startsWith('//')) return;
              let result = connection.query(cmd);
              let text = result.printExecutionResult().replace(/\r?\n/g, '\r\n')
              // console.log(`${result.toString()}`)
              kuzuTerm.writeln(`\r\n${text}`);
            }
          });
          // var result = connection.query(currentLineContent);
          // let text = result.printExecutionResult().replace(/\r?\n/g, '\r\n')
          // console.log(`${result.toString()}`)
          // kuzuTerm.writeln(`\r\n${text}`);
        } catch (error) {
          kuzuTerm.writeln(`\r\nError: ${error.message}`);
        }
      }
      kuzuTerm.onKey(({ key, domEvent }) => {
        const printable = !domEvent.altKey && !domEvent.altGraphKey && !domEvent.ctrlKey && !domEvent.metaKey;
        // console.log(domEvent.key)
        if (domEvent.key === 'Enter') {
          const inputString = kuzuTerm.buffer.active.getLine(0)?.translateToString().trim();
          //get current line
          const currentLineContent = getCurrentLineContent();
          if (currentLineContent == "ls") {
            let file_list = window.kuzu.FS.readdir('data').filter(e => e !== '.' && e !== '..')
            //print file list
            if (file_list.length != 0) kuzuTerm.write('\r\n' + file_list.join(' '))
            // console.log(file_list)
          } else if (currentLineContent == "upload") {
            fileInputRef.current.click();
          }
          else if (currentLineContent == "clear") {
            // kuzuTerm.writeln("\r\n")
            kuzuTerm.clear();
          }
          else if (currentLineContent == "help") {
            helpHint(kuzuTerm);
          }
          else if (currentLineContent == "examples") {
            examplesHint(kuzuTerm);
          }
          else if (!UI_debug && inputString && connection) {
            executeCommand(currentLineContent)
          }
          else {
            kuzuTerm.write('\r\nUI debug mode'); console.log(UI_debug, inputString, connection)
          }
          kuzuTerm.prompt();
        } else if (domEvent.key == 'Backspace') {
          if (kuzuTerm.buffer.active.cursorX > PROMPT.length) {
            kuzuTerm.write('\b \b');
          }
        }else if (domEvent.key === "ArrowUp" ){;}
        else if (domEvent.key === "ArrowDown" ){;}
        else if (domEvent.key === "ArrowLeft" || domEvent.key === "ArrowRight" ){kuzuTerm.write(key);}
        else if (printable) {
          //common chacater
          kuzuTerm.write(key);
          // console.log("write", key)
          let cur_line = getCurrentLineContent();
          if (key.trim() == "") return;
          // console.log("after insert",cur_line)
          let word = cur_line.split(" ").pop()
          // console.log(word)
          // console.log(cur_line.split(" "))
          // repaint the last word
          for (let i = 0; i < word.length; i++) {
            kuzuTerm.write('\b \b');
          }
          if (keywordList.includes(word.toUpperCase())){
            // use green color to print
            kuzuTerm.write('\x1b[1;36m')
            //add the keyword
            kuzuTerm.write(word);
            //reset the color
            kuzuTerm.write('\x1b[0m')
          }else{
            kuzuTerm.write('\x1b[0m')
            kuzuTerm.write(word);
            // console.log(word)
          }

        }
      });
    }
  }, [term, connection]);

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Shell;


