class Recipe:
    def __init__(self, code, name, material_type, materials):
        self.code = code
        self.name = name
        self.material_type = material_type 
        self.materials = materials

class Job:
    def __init__(self, job_id, client, product, weight, recipe_code, due_date, width_mm, thickness_mm, status="Pending"):
        self.job_id = job_id
        self.client = client
        self.product = product
        self.weight = float(weight)
        self.recipe_code = recipe_code
        self.due_date = due_date
        self.width_mm = float(width_mm)
        self.thickness_mm = float(thickness_mm)
        self.status = status  # New Field: Pending, In Progress, Completed

    def to_dict(self):
        return {
            "job_id": self.job_id,
            "client": self.client,
            "product": self.product,
            "weight": self.weight,
            "recipe_code": self.recipe_code,
            "due_date": self.due_date,
            "width_mm": self.width_mm,
            "thickness_mm": self.thickness_mm,
            "status": self.status
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data["job_id"], 
            data["client"], 
            data["product"], 
            data["weight"], 
            data["recipe_code"], 
            data["due_date"], 
            data.get("width_mm", 0), 
            data.get("thickness_mm", 0.05),
            data.get("status", "Pending") # Default for old data
        )

class Machine:
    def __init__(self, machine_id, machine_type, max_width_mm, allowed_materials, min_thick=0.0, max_thick=1.0, status="Idle", notes="", capacity_kg_hr=150):
        self.machine_id = machine_id
        self.machine_type = machine_type 
        clean_width = str(max_width_mm).upper().replace(" MM", "").replace("''", "").replace('"', "")
        try:
            self.max_width_mm = float(clean_width)
        except ValueError:
            self.max_width_mm = 0.0
        self.allowed_materials = allowed_materials
        self.min_thick = float(min_thick) 
        self.max_thick = float(max_thick)
        self.status = status 
        self.notes = notes
        self.capacity_kg_hr = float(capacity_kg_hr)

    def to_dict(self):
        return {
            "machine_id": self.machine_id,
            "machine_type": self.machine_type,
            "max_width_mm": f"{self.max_width_mm} MM", 
            "allowed_materials": self.allowed_materials,
            "min_thick": self.min_thick,
            "max_thick": self.max_thick,
            "status": self.status,
            "notes": self.notes,
            "capacity_kg_hr": self.capacity_kg_hr
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data["machine_id"], 
            data["machine_type"], 
            str(data["max_width_mm"]), 
            data.get("allowed_materials", []), 
            data.get("min_thick", 0.0), 
            data.get("max_thick", 1.0),
            data.get("status", "Idle"), 
            data.get("notes", ""),
            data.get("capacity_kg_hr", 150)
        )

class ProductionLog:
    def __init__(self, log_id, date, job_id, output_kg, wastage_kg, materials_consumed, stage="Extrusion"):
        self.log_id = log_id
        self.date = date
        self.job_id = job_id
        self.output_kg = float(output_kg)
        self.wastage_kg = float(wastage_kg)
        self.materials_consumed = materials_consumed 
        self.stage = stage # New Field: Extrusion, Cutting, Printing, Packaging

    @property
    def total_processed(self):
        return self.output_kg + self.wastage_kg

    def to_dict(self):
        return {
            "log_id": self.log_id,
            "date": self.date,
            "job_id": self.job_id,
            "output_kg": self.output_kg,
            "wastage_kg": self.wastage_kg,
            "materials_consumed": self.materials_consumed,
            "stage": self.stage
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            data["log_id"], 
            data["date"], 
            data["job_id"], 
            data["output_kg"], 
            data.get("wastage_kg", 0.0), 
            data["materials_consumed"],
            data.get("stage", "Extrusion") # Default old logs to Extrusion
        )