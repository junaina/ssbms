import { Service } from "./service.model.js";

export const serviceRepo = {
  listByProvider(providerId) {
    return Service.find({ providerId }).sort({ createdAt: -1 });
  },

  findOwnedById(serviceId, providerId) {
    return Service.findOne({ _id: serviceId, providerId });
  },

  updateOwned(serviceId, providerId, patch) {
    return Service.findOneAndUpdate({ _id: serviceId, providerId }, { $set: patch }, { new: true });
  },

  deleteOwned(serviceId, providerId) {
    return Service.findOneAndDelete({ _id: serviceId, providerId });
  },
  createForProvider(providerId, data) {
    return Service.create({ ...data, providerId });
  },
  findById(serviceId) {
    return Service.findById(serviceId);
  },

  searchPublic({ search }) {
    const filter = {};
    if (search) {
      const s = search.trim();
      filter.$or = [
        { title: { $regex: s, $options: "i" } },
        { description: { $regex: s, $options: "i" } },
      ];
    }

    // we will filter provider approval in service.service using userRepo (simple, safe for MVP)
    return Service.find(filter).sort({ createdAt: -1 });
  },
};
