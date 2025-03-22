const fs = require('fs');

function loadEnvFile(filePath) {
    if (fs.existsSync(filePath)) {
        const envFile = fs.readFileSync(filePath, 'utf8');

        const envVars = {};

        envFile.split(/\r?\n/).forEach(line => {
            line = line.trim();
            if (!line || line.startsWith('#')) {
                return;
            }


            const firstEqualIndex = line.indexOf('=');
            if (firstEqualIndex > 0) {
                const key = line.substring(0, firstEqualIndex).trim();
                const value = line.substring(firstEqualIndex + 1).trim();

                envVars[key] = value.replace(/^["'](.*)["']$/, '$1');
            }
        });

        return envVars;
    } else {
        console.error(`.env file not found at ${filePath}`);
        return {};
    }
}

module.exports = loadEnvFile;