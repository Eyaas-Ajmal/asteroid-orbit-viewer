import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Rocket, AlertTriangle, Shield } from "lucide-react";
import { toast } from "sonner";

interface AsteroidData {
  magnitude: number;
  diameter: number;
  albedo: number;
  semi_major_axis: number;
  perihelion_distance: number;
  inclination: number;
  aphelion_distance: number;
  mean_motion: number;
  time_of_perihelion: number;
  orbital_period: number;
}

interface PredictionResult {
  Predicted_MOID_AU: number;
  Risk_Label: number;
  Risk: string;
  Risk_Probability?: number;
}

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<AsteroidData>({
    magnitude: 19.5,
    diameter: 0.5,
    albedo: 0.15,
    semi_major_axis: 2.5,
    perihelion_distance: 1.8,
    inclination: 10.5,
    aphelion_distance: 3.2,
    mean_motion: 0.2,
    time_of_perihelion: 2459000.5,
    orbital_period: 1500.0,
  });

  const handleInputChange = (field: keyof AsteroidData, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData((prev) => ({ ...prev, [field]: numValue }));
    }
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data: PredictionResult = await response.json();
      setResult(data);
      toast.success("Prediction completed successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error("Failed to get prediction. Make sure the backend is running at http://127.0.0.1:8000");
    } finally {
      setLoading(false);
    }
  };

  const inputFields: { label: string; field: keyof AsteroidData; unit: string; placeholder: string }[] = [
    { label: "Magnitude", field: "magnitude", unit: "", placeholder: "e.g., 19.5" },
    { label: "Diameter", field: "diameter", unit: "km", placeholder: "e.g., 0.5" },
    { label: "Albedo", field: "albedo", unit: "", placeholder: "e.g., 0.15" },
    { label: "Semi-Major Axis", field: "semi_major_axis", unit: "AU", placeholder: "e.g., 2.5" },
    { label: "Perihelion Distance", field: "perihelion_distance", unit: "AU", placeholder: "e.g., 1.8" },
    { label: "Inclination", field: "inclination", unit: "deg", placeholder: "e.g., 10.5" },
    { label: "Aphelion Distance", field: "aphelion_distance", unit: "AU", placeholder: "e.g., 3.2" },
    { label: "Mean Motion", field: "mean_motion", unit: "deg/day", placeholder: "e.g., 0.2" },
    { label: "Time of Perihelion", field: "time_of_perihelion", unit: "JD", placeholder: "e.g., 2459000.5" },
    { label: "Orbital Period", field: "orbital_period", unit: "days", placeholder: "e.g., 1500.0" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 pt-8 pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Rocket className="h-10 w-10 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-nebula bg-clip-text text-transparent">
              Asteroid MOID & Risk Predictor
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Predict Minimum Orbit Intersection Distance and assess asteroid hazard risk using advanced ML models
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="glass-card border-border/50 transition-smooth hover:border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span className="text-primary">📊</span>
                Asteroid Orbital Parameters
              </CardTitle>
              <CardDescription>Enter the asteroid's orbital characteristics below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputFields.map(({ label, field, unit, placeholder }) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="text-sm font-medium">
                      {label} {unit && <span className="text-muted-foreground">({unit})</span>}
                    </Label>
                    <Input
                      id={field}
                      type="number"
                      step="any"
                      value={formData[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      placeholder={placeholder}
                      className="bg-secondary/50 border-border/50 focus:border-primary transition-smooth"
                    />
                  </div>
                ))}
              </div>

              <Button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6 shadow-glow-primary transition-smooth"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Trajectory...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Predict Risk
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className="glass-card border-border/50 transition-smooth hover:border-accent/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span className="text-accent">🎯</span>
                Prediction Results
              </CardTitle>
              <CardDescription>
                {result ? "Analysis complete" : "Awaiting prediction..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!result && !loading && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                    <Rocket className="h-24 w-24 text-primary/60 relative" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Enter parameters and click "Predict Risk" to begin analysis
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-muted-foreground animate-pulse">Processing orbital data...</p>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* MOID Value */}
                  <div className="p-6 rounded-lg bg-secondary/50 border border-border/50 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Predicted MOID
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {result.Predicted_MOID_AU.toFixed(4)} AU
                    </p>
                    <p className="text-xs text-muted-foreground">Minimum Orbit Intersection Distance</p>
                  </div>

                  {/* Risk Classification */}
                  <div
                    className={`p-6 rounded-lg border space-y-4 ${
                      result.Risk === "Hazardous"
                        ? "bg-destructive/10 border-destructive/50 shadow-glow-hazard"
                        : "bg-success/10 border-success/50 shadow-glow-safe"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Risk Assessment
                      </p>
                      {result.Risk === "Hazardous" ? (
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      ) : (
                        <Shield className="h-6 w-6 text-success" />
                      )}
                    </div>

                    <div className="space-y-3">
                      <Badge
                        variant={result.Risk === "Hazardous" ? "destructive" : "default"}
                        className={`text-lg px-4 py-2 ${
                          result.Risk === "Hazardous"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-success text-success-foreground"
                        }`}
                      >
                        {result.Risk}
                      </Badge>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Risk Label</p>
                          <p className="text-2xl font-bold">{result.Risk_Label}</p>
                        </div>
                        {result.Risk_Probability !== undefined && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Probability</p>
                            <p className="text-2xl font-bold">{(result.Risk_Probability * 100).toFixed(1)}%</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <p className="text-xs text-muted-foreground text-center">
                      {result.Risk === "Hazardous"
                        ? "⚠️ This asteroid requires further monitoring and analysis"
                        : "✓ This asteroid poses minimal risk based on current orbital parameters"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="text-primary font-semibold">FastAPI</span> +{" "}
            <span className="text-accent font-semibold">ML</span> +{" "}
            <span className="text-primary font-semibold">React</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
