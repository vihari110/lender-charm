import { Link } from "react-router-dom";
import { UserPlus, Building2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Lead Management</h1>
          <p className="text-muted-foreground">Create and manage your borrower and lender leads</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/new-lender-lead"
            className="lead-card p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  New Lender Lead
                </h2>
                <p className="text-sm text-muted-foreground">
                  Add a new lender or investor lead
                </p>
              </div>
            </div>
          </Link>

          <div className="lead-card p-6 opacity-50 cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-lead-pink/10 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-lead-pink" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  New Borrower Lead
                </h2>
                <p className="text-sm text-muted-foreground">
                  Coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
