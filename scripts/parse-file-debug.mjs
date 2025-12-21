#!/usr/bin/env node
import fs from 'fs/promises';
import parser from '@typescript-eslint/parser';
const path = process.argv[2];
(async ()=>{
  try{
    const src = await fs.readFile(path,'utf8');
    const res = parser.parse(src, { loc: true, range: true, ecmaVersion: 2022, sourceType:'module', ecmaFeatures: { jsx: true } });
    console.log('Parsed OK');
  }catch(e){
    console.error('Parse error:', e.message);
    console.error(e.codeFrame || e.lineNumber+':'+e.column);
    process.exit(1);
  }
})();