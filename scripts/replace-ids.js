#!/usr/bin/env node
/**
 * replace-ids.js
 * Replaces all old IDs with new IDs across the project source files.
 * Uses simple string replacement sorted by descending length to prevent substring corruption.
 * Since all IDs appear as quoted strings in JS/Vue/JSON, we just replace the string literals.
 */

const fs = require('fs')
const path = require('path')

const MAP_FILE = path.join(__dirname, 'id-map.json')
const PROJECT_ROOT = path.join(__dirname, '..')

const TARGET_FILES = [
  'src/store.js',
  'src/App.vue',
  'src/components/Buildable.vue',
  'src/components/Emc.vue',
  'src/components/CalcSegment.vue',
  'src/components/Costs.vue',
  'src/locales/en.json',
  'src/locales/fr.json',
]

function main() {
  const raw = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'))

  // Flatten all categories into a single map, skip identity mappings
  const flatMap = {}
  for (const category of Object.values(raw)) {
    for (const [oldId, newId] of Object.entries(category)) {
      if (oldId !== newId) {
        flatMap[oldId] = newId
      }
    }
  }

  // Sort by descending length of old ID to prevent substring corruption
  // e.g., 'techEnergyStorage6' must be replaced before 'techEnergyStorage1' before 'energy'
  const sortedEntries = Object.entries(flatMap).sort((a, b) => b[0].length - a[0].length)

  console.log(`Loaded ${sortedEntries.length} ID mappings`)
  console.log(`Processing ${TARGET_FILES.length} files...\n`)

  let grandTotal = 0

  for (const relPath of TARGET_FILES) {
    const filePath = path.join(PROJECT_ROOT, relPath)

    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP: ${relPath} (not found)`)
      continue
    }

    let content = fs.readFileSync(filePath, 'utf8')
    let fileTotal = 0

    for (const [oldId, newId] of sortedEntries) {
      // Count occurrences before replacement
      const count = (content.match(new RegExp(oldId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length

      if (count > 0) {
        // Simple string replace - works because:
        // 1. All IDs appear as quoted strings: 'metal', "metal", metal.png, metalPane
        // 2. Sorted by descending length, so 'metalPane' is replaced before 'metal'
        // 3. Longer IDs are always more specific, so partial matches are safe
        content = content.split(oldId).join(newId)
        fileTotal += count
      }
    }

    // Handle star→fief pattern (star followed by digits)
    const starCount = (content.match(/star(\d+)/g) || []).length
    if (starCount > 0) {
      content = content.replace(/star(\d+)/g, 'fief$1')
      fileTotal += starCount
    }

    if (fileTotal > 0) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`  DONE: ${relPath} (${fileTotal} replacements)`)
      grandTotal += fileTotal
    } else {
      console.log(`  NOOP: ${relPath} (no changes)`)
    }
  }

  console.log(`\nTotal replacements: ${grandTotal}`)
  console.log('\nIMPORTANT: Manual verification required for:')
  console.log('  - store.js onBuild() hardcoded ID lists')
  console.log('  - store.js computeProdValues() special cases')
  console.log('  - store.js state field names (emcAmount, etc.)')
  console.log('  - Buildable.vue hardcoded checks')
  console.log('  - CalcSegment.vue hardcoded resource references')
  console.log('  - Emc.vue state field references')
}

main()
