import { OnboardOutletContext, OnboardState } from "@/types/onboarding";
import { useEffect, useState, useCallback, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";

const LS_KEY = "onboard:v1";
const STEPS = ["country", "path"] as const;

function indexOfStep(step: string): number {
  const idx = STEPS.indexOf(step as (typeof STEPS)[number]);
  return idx === -1 ? 0 : idx;
}

function firstIncompleteStep(state: OnboardState): string {
  if (!state?.country?.selected) return "country";
  if (!state?.path?.selected) return "path";
  return "path";
}

export default function OnboardingLayout() {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<OnboardState | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const mountedRef = useRef(false);
  const { user, updateOnboardingStatus } = useAuth();

  const load = useCallback(() => {
    setLoading(true);
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed: OnboardState = raw ? JSON.parse(raw) : { country: {}, path: {} };
      setState(parsed);
    } catch (e) {
      setState({ country: {}, path: {} });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Move the navigation logic to useEffect
  useEffect(() => {
    if (loading || state == null) return;

    // Only enforce redirect on the initial hydration (first mount).
    if (mountedRef.current) {
      // Already mounted once — skip redirect to allow Back/Forward and manual URL edits.
      return;
    }
    mountedRef.current = true;

    const parts = location.pathname.split("/").filter(Boolean);
    const requested = parts[parts.length - 1] || "country";
    const earliest = firstIncompleteStep(state);

    if (indexOfStep(requested) < indexOfStep(earliest)) {
      navigate(`/onboarding/${earliest}`, { replace: true });
    }
  }, [loading, state, location.pathname, navigate]);

  // Safe state update function
  const persist = useCallback((patch: Partial<OnboardState>) => {
    setState((prev) => {
      const merged = {
        ...(prev ?? { country: {}, path: {} }),
        ...patch,
      };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(merged));
      } catch (e) {
        console.log(e);
        // ignore local storage errors
      }
      return merged;
    });
  }, []);

  // Function to mark onboarding as completed
  const completeOnboarding = useCallback(() => {
    if (user) {
      // Update the onboarding status in auth context
      updateOnboardingStatus(true);
    }
  }, [user, updateOnboardingStatus]);

  if (loading || state == null) {
    return <div>Loading onboarding…</div>;
  }

  const context: OnboardOutletContext = {
    state,
    persist,
    navigate: (to: string | number, options?: { replace?: boolean }) => {
      if (typeof to === "number") {
        navigate(to);
      } else {
        navigate(to, { replace: options?.replace });
      }
    },
    completeOnboarding, // Add this function to the context
  };

  return <Outlet context={context} />;
}
