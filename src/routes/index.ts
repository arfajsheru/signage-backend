import { FastifyInstance } from "fastify";
import vendorRoutes from "../modules/vendor/vendor.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import businessTypeRoutes from "../modules/businessType/businessType.routes.js";
import projectRoutes from "../modules/project/project.routes.js";
import projectAssignmentRoutes from "../modules/projectAssignment/projectAssignment.routes.js";
import stageTypeMasterRoutes from "../modules/stageTypeMaster/stageTypeMaster.routes.js";
import projectWorkflowRoutes from "../modules/projectWorkflow/projectWorkflow.routes.js";
import documentTypeRoutes from "../modules/documentType/documentType.routes.js";
import stageFileRoutes from "../modules/stageFile/stageFile.routes.js";
import stageApprovalRoutes from "../modules/stageApproval/stageApproval.routes.js";
import roleRoutes from "../modules/role/role.routes.js";
import channelPartnerRoutes from "../modules/channelPartner/channelPartner.routes.js";
import dxfRoutes from "../modules/dxf/dxf.routes.js";

/**
 * Centralized route registration for the API
 */
export default async function appRoutes(app: FastifyInstance) {
  // Health check for API
  app.get("/health", async () => {
    return { 
      status: "OK", 
      version: "v1",
      timestamp: new Date().toISOString() 
    };
  });

  // Register All Modules
  await app.register(vendorRoutes, { prefix: "/vendors" });
  await app.register(userRoutes, { prefix: "/users" });
  await app.register(businessTypeRoutes, { prefix: "/business-types" });
  await app.register(projectRoutes, { prefix: "/projects" });
  await app.register(projectAssignmentRoutes, { prefix: "/project-assignments" });
  await app.register(stageTypeMasterRoutes, { prefix: "/stage-types" });
  await app.register(projectWorkflowRoutes, { prefix: "/project-workflows" });
  await app.register(documentTypeRoutes, { prefix: "/document-types" });
  await app.register(stageFileRoutes, { prefix: "/stage-files" });
  await app.register(stageApprovalRoutes, { prefix: "/stage-approvals" });
  await app.register(roleRoutes, { prefix: "/roles" });
  await app.register(channelPartnerRoutes, { prefix: "/channel-partners" });
  await app.register(dxfRoutes, { prefix: "/dxf" });
}
