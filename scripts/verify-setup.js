const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkCommand(command, name) {
    try {
        const version = execSync(command, { encoding: 'utf8' }).trim();
        console.log(`✅ ${name}: ${version}`);
        return true;
    } catch (error) {
        console.log(`❌ ${name}: No encontrado`);
        return false;
    }
}

function checkFile(filePath) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${filePath}`);
        return true;
    } else {
        console.log(`❌ ${filePath} - ARCHIVO FALTANTE`);
        return false;
    }
}

async function verifySetup() {
    console.log('🔍 Verificando configuración del proyecto...\n');
    
    let allGood = true;
    
    // Verificar comandos
    console.log('📦 Verificando herramientas...');
    allGood &= checkCommand('node --version', 'Node.js');
    allGood &= checkCommand('npm --version', 'npm');
    allGood &= checkCommand('newman --version', 'Newman');
    
    console.log('\n📁 Verificando archivos requeridos...');
    
    // Verificar estructura de directorios
    const dirs = ['src', 'collections', 'environments', 'scripts', 'reports'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`📁 Creado directorio: ${dir}`);
        }
    });
    
    // Verificar archivos clave
    const requiredFiles = [
        'src/server.js',
        'collections/user-api-tests.postman_collection.json',
        'environments/dev.postman_environment.json'
    ];
    
    requiredFiles.forEach(file => {
        allGood &= checkFile(file);
    });
    
    // Verificar archivos opcionales
    const optionalFiles = [
        'collections/security-tests.postman_collection.json',
        'scripts/analyze-results.js'
    ];
    
    console.log('\n📋 Archivos opcionales:');
    optionalFiles.forEach(file => {
        checkFile(file);
    });
    
    console.log('\n' + '='.repeat(50));
    if (allGood) {
        console.log('🎉 ¡Configuración completa y lista!');
        console.log('\n🚀 Puedes ejecutar:');
        console.log('   npm start          - Iniciar servidor');
        console.log('   npm run test       - Ejecutar pruebas');
        console.log('   npm run test:ci    - Pruebas para CI');
    } else {
        console.log('⚠️  Algunos elementos están faltando.');
        console.log('   Revisa los archivos marcados con ❌');
    }
    console.log('='.repeat(50));
}

if (require.main === module) {
    verifySetup().catch(console.error);
}

module.exports = { verifySetup };