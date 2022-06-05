import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';

const file = fs.readFileSync(path.join(__dirname, '../api-docs/swagger-output.json'), 'utf8');
const specs = JSON.parse(file);

export default { swaggerUi, specs };
