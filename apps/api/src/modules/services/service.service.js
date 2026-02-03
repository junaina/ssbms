import { ApiError } from "../../utils/ApiError.js";
import { serviceRepo } from "./service.repo.js";

function pickEditable(body) {
  const patch = {};
  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim())
      throw new ApiError(400, "title must be a string");
    patch.title = body.title.trim();
  }
  if (body.description !== undefined) {
    if (typeof body.description !== "string")
      throw new ApiError(400, "description must be a string");
    patch.description = body.description;
  }
  if (body.price !== undefined) {
    const n = Number(body.price);
    if (!Number.isFinite(n) || n < 0)
      throw new ApiError(400, "price must be a non-negative number");
    patch.price = n;
  }
  if (body.duration !== undefined) {
    const n = Number(body.duration);
    if (!Number.isFinite(n) || n < 1) throw new ApiError(400, "duration must be a positive number");
    patch.duration = n;
  }

  if (Object.keys(patch).length === 0) throw new ApiError(400, "no editable fields provided");
  return patch;
}
function validateCreate(body) {
  const title = (body.title ?? "").toString().trim();
  if (!title) throw new ApiError(400, "title is required");

  const description = body.description === undefined ? "" : body.description.toString();

  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0)
    throw new ApiError(400, "price must be a non-negative number");

  const duration = Number(body.duration);
  if (!Number.isFinite(duration) || duration < 1)
    throw new ApiError(400, "duration must be a positive number");

  return { title, description, price, duration };
}

export const serviceService = {
  async listMyServices(providerId) {
    return serviceRepo.listByProvider(providerId);
  },

  async updateMyService(providerId, serviceId, body) {
    const patch = pickEditable(body);
    const updated = await serviceRepo.updateOwned(serviceId, providerId, patch);
    if (!updated) throw new ApiError(404, "service not found");
    return updated;
  },

  async deleteMyService(providerId, serviceId) {
    const deleted = await serviceRepo.deleteOwned(serviceId, providerId);
    if (!deleted) throw new ApiError(404, "service not found");
    return { deletedId: serviceId };
  },
  async createMyService(providerId, body) {
    const data = validateCreate(body);
    const created = await serviceRepo.createForProvider(providerId, data);
    return created;
  },
};
