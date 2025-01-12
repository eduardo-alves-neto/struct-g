import { GluegunToolbox } from 'gluegun'
import process = require('process')
import fs = require('fs')
import path = require('path')

module.exports = {
  name: 'initializing:structures',
  alias: ['init'],
  description: 'Initializing structures',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { success, info },
      template,
      filesystem,
    } = toolbox

    const basePath = process.cwd()
    const folderName = 'create_structures'
    const Templates = 'templates'

    const folderPath = `${basePath}/${folderName}`
    filesystem.dir(folderPath)
    filesystem.dir(`${folderPath}/${Templates}`)

    await template.generate({
      template: 'struct.ejs',
      target: `${folderPath}/struct.ts`,
    })

    await template.generate({
      template: 'teste.tsx.ejs',
      target: `${folderPath}/${Templates}/teste.tsx.ejs`,
    })

    const gitignorePath = path.join(basePath, '.gitignore')

    if (fs.existsSync(gitignorePath)) {
      let gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8')

      if (!gitignoreContent.includes(folderName)) {
        gitignoreContent += `\n${folderName}/\n`
        fs.writeFileSync(gitignorePath, gitignoreContent)
      }
    } else {
      fs.writeFileSync(gitignorePath, `${folderName}/\n`)
    }

    success(
      `Arquivos de configurações criados! Ajuste a strutura e os templates dos seus aquivos`
    )
    info(
      'Depois execute: sg generata:screen pages TelaDeTeste, para testar a cli'
    )
  },
}
