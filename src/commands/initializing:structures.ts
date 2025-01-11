import { GluegunToolbox } from 'gluegun'
import process = require('process')

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
      template: 'struct.json.ejs',
      target: `${folderPath}/struct.json`,
    })

    await template.generate({
      template: 'teste.tsx.ejs',
      target: `${folderPath}/${Templates}/teste.tsx.ejs`,
    })

    success(
      `Arquivos de configurações criados! Ajuste a strutura e os templates dos seus aquivos`
    )
    info(
      'Depois execute: sg generata:screen pages TelaDeTeste, para testar a cli'
    )
  },
}
