import { userRepo } from "../users/user.repo.js";
import { serviceRepo } from "./service.repo.js";

export const servicePublicService = {
  async searchServices(search) {
    const services = await serviceRepo.searchPublic({ search });

    // Only show services from approved providers
    const providerIds = [...new Set(services.map((s) => s.providerId?.toString()).filter(Boolean))];
    if (providerIds.length === 0) return [];

    const approvedProviders = await userRepo.findManyByIds(providerIds).select("_id isApproved");

    const approvedSet = new Set(
      approvedProviders.filter((p) => p.isApproved).map((p) => p._id.toString()),
    );

    return services.filter((s) => approvedSet.has(s.providerId.toString()));
  },
};
