"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const trpc_service_1 = require("./trpc/trpc.service");
const trpcExpress = require("@trpc/server/adapters/express");
const context_1 = require("./trpc/context");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const trpcService = app.get(trpc_service_1.TrpcService);
    app.use('/trpc', trpcExpress.createExpressMiddleware({
        router: trpcService.appRouter,
        createContext: context_1.createContext,
    }));
    await app.listen(4000);
    console.log('Backend running on http://localhost:4000');
}
bootstrap();
//# sourceMappingURL=main.js.map