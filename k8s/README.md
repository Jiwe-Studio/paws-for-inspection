# EKS deployment

Paws for Inspection runs as its own Deployment/Service in the `jiweio`
namespace of the `jiwe-production` EKS cluster (us-east-1), served at
`https://quirklog.com/games/paws-for-inspection/`. It has no secrets and no
storage: progress lives in the player's localStorage.

- `prod/deployment.yaml`, `prod/service.yaml` - applied once by hand from
  the `jiwe-mgmt-bastion` (the EKS API is IP-locked). `${SHA}` is the image
  tag to start on.
- Routing lives in the shared `quirklog` Ingress (owned outside this repo),
  which needs a `/games/paws-for-inspection` Prefix path pointing at
  `paws-for-inspection-prod-svc:80`, listed above the `/` catch-all.
- After that, pushes to `main` build an image, push it to ECR
  (`jiwe-studio/paws-for-inspection`) and roll it out with an image-only
  `kubectl set image` through the bastion; see
  `.github/workflows/prod-deploy-aws.yaml`.
