import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importMap = {
  'radix-ui/react-label': 'LabelPrimitive',
  'radix-ui/react-progress': 'ProgressPrimitive',
  'radix-ui/react-slider': 'SliderPrimitive',
  'radix-ui/react-checkbox': 'CheckboxPrimitive',
  'radix-ui/react-context-menu': 'ContextMenuPrimitive',
  'radix-ui/react-dialog': 'DialogPrimitive',
  'radix-ui/react-drawer': 'DrawerPrimitive',
  'radix-ui/react-dropdown-menu': 'DropdownMenuPrimitive',
  'radix-ui/react-hover-card': 'HoverCardPrimitive',
  'radix-ui/react-input-otp': 'OTPInput',
  'radix-ui/react-label': 'LabelPrimitive',
  'radix-ui/react-menubar': 'MenubarPrimitive',
  'radix-ui/react-navigation-menu': 'NavigationMenuPrimitive',
  'radix-ui/react-popover': 'PopoverPrimitive',
  'radix-ui/react-radio-group': 'RadioGroupPrimitive',
  'radix-ui/react-resizable': 'ResizablePrimitive',
  'radix-ui/react-scroll-area': 'ScrollAreaPrimitive',
  'radix-ui/react-select': 'SelectPrimitive',
  'radix-ui/react-separator': 'SeparatorPrimitive',
  'radix-ui/react-sheet': 'SheetPrimitive',
  'radix-ui/react-sidebar': 'SidebarPrimitive',
  'radix-ui/react-switch': 'SwitchPrimitive',
  'radix-ui/react-tabs': 'TabsPrimitive',
  'radix-ui/react-toggle': 'TogglePrimitive',
  'radix-ui/react-toggle-group': 'ToggleGroupPrimitive',
  'radix-ui/react-tooltip': 'TooltipPrimitive',
  'recharts': 'RechartsPrimitive',
};

function fixImports(content) {
  let fixed = content;
  
  // Fix broken imports like: import * as radix-ui/react-label from "@radix-ui/react-label";
  for (const [packageName, importName] of Object.entries(importMap)) {
    const pattern = new RegExp(`import \\* as ${packageName.replace(/\//g, '/')} from "@${packageName}";`, 'g');
    fixed = fixed.replace(pattern, `import * as ${importName} from "@${packageName}";`);
  }
  
  // Fix any remaining broken patterns
  fixed = fixed.replace(/import \* as ([a-z-]+)\/([a-z-]+) from "@([^"]+)";/g, (match, p1, p2, p3) => {
    const key = `${p1}/${p2}`;
    if (importMap[key]) {
      return `import * as ${importMap[key]} from "@${p3}";`;
    }
    // Default: capitalize first letter of each part
    const name = p1.charAt(0).toUpperCase() + p1.slice(1) + p2.charAt(0).toUpperCase() + p2.slice(1) + 'Primitive';
    return `import * as ${name} from "@${p3}";`;
  });
  
  return fixed;
}

function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      findJsFiles(filePath, fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function fixAllFiles() {
  const srcDir = path.join(__dirname, 'src', 'app', 'components', 'ui');
  const jsFiles = findJsFiles(srcDir);
  
  console.log(`Found ${jsFiles.length} UI component files to fix`);
  
  jsFiles.forEach(jsFile => {
    try {
      const content = fs.readFileSync(jsFile, 'utf-8');
      if (content.includes('import * as') && content.includes('radix-ui') || content.includes('recharts')) {
        const fixed = fixImports(content);
        if (fixed !== content) {
          fs.writeFileSync(jsFile, fixed, 'utf-8');
          console.log(`Fixed: ${path.relative(__dirname, jsFile)}`);
        }
      }
    } catch (error) {
      console.error(`Error fixing ${jsFile}:`, error.message);
    }
  });
  
  console.log('Fix complete!');
}

fixAllFiles();
