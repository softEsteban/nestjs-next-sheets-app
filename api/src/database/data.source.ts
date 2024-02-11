import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv'

dotenv.config();

export const dataSourcerOptions : DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRE_HOST,
    port: parseInt(process.env.POSTGRE_PORT),
    username: process.env.POSTGRE_USER,
    password: process.env.POSTGRE_PASSWORD,
    database: process.env.POSTGRE_DATABASE,
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/database/migrations/*.js"],
    synchronize: false
};

const dataSource = new DataSource(dataSourcerOptions);
export default dataSource;