import { Request, Response, NextFunction } from 'express';

export const enforceTenantIsolation = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Authentication required.' });
    return;
  }

  // Super Admin bypasses tenant restriction for platform-wide operations
  if (req.user.role === 'SUPER_ADMIN') {
    next();
    return;
  }

  const requestedSocietyId = req.params.societyId || req.body.societyId || req.query.societyId;

  if (!req.user.societyId) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Account is not associated with any residential society.'
    });
    return;
  }

  // If a specific society is targeted, verify tenant match
  if (requestedSocietyId && requestedSocietyId !== req.user.societyId) {
    res.status(403).json({
      success: false,
      error: 'Tenant Violation: You are not authorized to access or modify data for another society.'
    });
    return;
  }

  // Force downstream query tenancy
  req.societyId = req.user.societyId;
  next();
};
