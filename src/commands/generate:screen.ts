import { GluegunToolbox } from 'gluegun'
import processFolders from '../extensions/processFolder'
import processFiles from '../extensions/processFile'
import process = require('process')
import fs = require('fs')
import { IStructure } from '../types'

module.exports = {
  name: 'generate:screen',
  alias: ['gs'],
  description: 'Create new screen',
  run: async (toolbox: GluegunToolbox) => {
    const {
      print: { success, error, warning },
      filesystem,
      parameters,
      template,
    } = toolbox

    const userFolderPath = parameters.first
    const screenName = parameters.second

    const structConfigPath = `${process.cwd()}/create_structures/struct.ts`

    if (!fs.existsSync(structConfigPath)) {
      warning(
        'arquivo struct.json não encontrado ou aplicação não iniciada(sg init)'
      )
      return
    }

    const structConfig: IStructure =
      require(structConfigPath) || ({} as IStructure)

    if (!userFolderPath) {
      error(
        'Você precisa informar o caminho onde a tela será criada! Exemplo: sg generate <caminho-dentro-de-src>  Home'
      )
      return
    }

    if (!screenName) {
      error(
        'Você precisa informar o nome da tela! Exemplo: sg generate pages/stock <nome-da-tela>'
      )
      return
    }

    const folderPath = `src/${userFolderPath}/${screenName}`
    filesystem.dir(folderPath)

    for (const item of Object.keys(structConfig)) {
      const { files, folders: nestedFolders } = structConfig[item]
      const isRoot = item === 'root'

      if (files) {
        await processFiles(
          files,
          isRoot ? `${folderPath}` : `${folderPath}/${item}`,
          screenName,
          template
        )
      }

      if (nestedFolders) {
        await processFolders(
          nestedFolders,
          isRoot ? `${folderPath}` : `${folderPath}/${item}`,
          screenName,
          filesystem,
          template
        )
      }
    }

    success(`Tela ${screenName} criada com sucesso em: src/${userFolderPath}!`)
  },
}
