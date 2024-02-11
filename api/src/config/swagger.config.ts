import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {

  const config = new DocumentBuilder()
    .setTitle('OCMI Workers Comp API')
    .setDescription('Nestjs API to handle clients sheets and times management')
    .setVersion('1.0')
    .setExternalDoc('Esteban Toro - GitHub', 'https://github.com/softEsteban') 
    .setContact("Esteban Toro", "https://etoro-roan.vercel.app/", "estebantoro.ar@gmail.com")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customfavIcon: 'https://ocmiworkerscomp.com/wp-content/uploads/2023/07/OCMI-Workers-Comp-Logo.png',
    customCss: `
    .swagger-ui { margin-bottom: 100px; }
    .swagger-ui .topbar { background-color: #58387b; position: sticky; top: 0; z-index: 999;}
    .swagger-ui .topbar a { max-width: 150px; }
    .swagger-ui .topbar .download-url-wrapper { display: none }
    .topbar-wrapper .link { content:url('https://ocmiworkerscomp.com/wp-content/uploads/2023/07/OCMI-Workers-Comp-Logo.png'); 
    `,
    customSiteTitle: 'OCMI Workers Comp API',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    explorer: true
  });
}