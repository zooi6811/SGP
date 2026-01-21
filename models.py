class Recipe:
    def __init__(self, code, name, materials):
        self.code = code
        self.name = name
        self.materials = materials

class Job:
    def __init__(self, job_id, client, product, weight, recipe_code, due_date):
        self.job_id = job_id
        self.client = client
        self.product = product
        self.weight = float(weight)
        self.recipe_code = recipe_code
        self.due_date = due_date

    # --- NEW: Convert Object to Dictionary ---
    def to_dict(self):
        return {
            "job_id": self.job_id,
            "client": self.client,
            "product": self.product,
            "weight": self.weight,
            "recipe_code": self.recipe_code,
            "due_date": self.due_date
        }

    # --- NEW: Create Object from Dictionary ---
    @classmethod
    def from_dict(cls, data):
        return cls(data["job_id"], data["client"], data["product"], 
                   data["weight"], data["recipe_code"], data["due_date"])

class ProductionLog:
    def __init__(self, log_id, date, job_id, output_kg, wastage_kg, materials_consumed):
        self.log_id = log_id
        self.date = date
        self.job_id = job_id
        self.output_kg = float(output_kg)
        self.wastage_kg = float(wastage_kg)
        self.materials_consumed = materials_consumed

    def to_dict(self):
        return {
            "log_id": self.log_id,
            "date": self.date,
            "job_id": self.job_id,
            "output_kg": self.output_kg,
            "wastage_kg": self.wastage_kg,
            "materials_consumed": self.materials_consumed
        }

    @classmethod
    def from_dict(cls, data):
        return cls(data["log_id"], data["date"], data["job_id"], 
                   data["output_kg"], data["wastage_kg"], data["materials_consumed"])
    
class Machine:
    def __init__(self, machine_id, machine_type, max_width_mm, materials, status="Idle", notes=""):
        self.machine_id = machine_id
        self.machine_type = machine_type # "Blowing" or "Cutting"
        self.max_width_mm = max_width_mm
        self.materials = materials       # e.g. "HDPE, LDPE"
        self.status = status             # "Running", "Maintenance", "Idle", "Breakdown"
        self.notes = notes

    def to_dict(self):
        return {
            "machine_id": self.machine_id,
            "machine_type": self.machine_type,
            "max_width_mm": self.max_width_mm,
            "materials": self.materials,
            "status": self.status,
            "notes": self.notes
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data["machine_id"], 
            data["machine_type"], 
            data["max_width_mm"], 
            data["materials"], 
            data.get("status", "Idle"), 
            data.get("notes", "")
        )