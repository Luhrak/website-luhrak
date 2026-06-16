let _isDeployed = null;

if (Deno.env.has("IsDeployed")) {
  _isDeployed = Boolean(Deno.env.get("IsDeployed"));
} else {
  _isDeployed = false;
}

export const IsDeployed = () => _isDeployed;
