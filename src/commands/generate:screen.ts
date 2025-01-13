import { GluegunToolbox } from 'gluegun'
import processFolders from '../extensions/processFolder'
import processFiles from '../extensions/processFile'
import fs = require('fs')
import path = require('path')

export default {
  name: 'generate:screen',
  alias: ['gs'],
  description: 'Create new screen',
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const {
      print: { success, error, warning },
      filesystem,
      parameters,
      template,
    } = toolbox

    const userFolderPath = parameters.first
    const screenName = parameters.second

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

    const structConfigPath = path.resolve(
      process.cwd(),
      'create_structures/struct.ts'
    )
    const folderPath = `src/${userFolderPath}/${screenName}`
    filesystem.dir(folderPath)

    if (fs.existsSync(structConfigPath)) {
      try {
        const module = await import(structConfigPath)
        const structConfig = module.default

        for (const item of Object.keys(structConfig)) {
          const { files, folders: nestedFolders } = structConfig[item]
          const isRoot = item === 'root'

          if (files) {
            await processFiles(
              files,
              isRoot ? `${folderPath}` : `${folderPath}/${item}`,
              screenName || '',
              template
            )
          }

          if (nestedFolders) {
            await processFolders(
              nestedFolders,
              isRoot ? `${folderPath}` : `${folderPath}/${item}`,
              screenName || '',
              filesystem,
              template
            )
          }
        }

        success(
          `Tela ${screenName} criada com sucesso em: src/${userFolderPath}!`
        )
      } catch (erro) {
        warning('Não foi possível importar o arquivo struct.ts')
        error(erro)
        return
      }
    } else {
      warning(
        'arquivo struct.ts não encontrado ou aplicação não iniciada(sg init)'
      )
      return
    }
  },
}
