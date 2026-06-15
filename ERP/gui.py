import tkinter as tk
from tkinter import ttk, messagebox, simpledialog
from datetime import datetime, date
import logic
import database

class SGPPlannerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("SGP Production Management System")
        self.geometry("1280x900") # Wider for the dashboard
        
        # Styles
        style = ttk.Style(self)
        style.theme_use('clam')
        style.configure("Treeview", rowheight=30, font=('Arial', 10))
        style.configure("Treeview.Heading", font=('Arial', 11, 'bold'))
        
        # KPI Card Styles
        style.configure("KPI.TFrame", background="#ecf0f1", relief="raised")
        style.configure("KPIValue.TLabel", font=('Arial', 24, 'bold'), background="#ecf0f1", foreground="#2c3e50")
        style.configure("KPITitle.TLabel", font=('Arial', 10), background="#ecf0f1", foreground="#7f8c8d")
        
        self.create_widgets()

    def create_widgets(self):
        # Header
        header = tk.Frame(self, bg="#2c3e50", height=60)
        header.pack(fill="x")
        tk.Label(header, text="SGP PRODUCTION MANAGEMENT SYSTEM", 
                 fg="white", bg="#2c3e50", font=("Arial", 18, "bold")).pack(pady=15)

        # Tabs
        self.notebook = ttk.Notebook(self)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Define Tabs
        self.tab_dash = ttk.Frame(self.notebook) # NEW
        self.tab_prod = ttk.Frame(self.notebook)
        self.tab_sched = ttk.Frame(self.notebook)
        self.tab_progress = ttk.Frame(self.notebook)
        self.tab_inv = ttk.Frame(self.notebook)
        self.tab_daily = ttk.Frame(self.notebook)
        self.tab_mach = ttk.Frame(self.notebook)
        
        # Add Tabs (Dashboard First)
        self.notebook.add(self.tab_dash, text="  🚀 Dashboard  ")
        self.notebook.add(self.tab_prod, text="  📅 Job Entry  ")
        self.notebook.add(self.tab_sched, text="  ⏱️ Smart Schedule  ")
        self.notebook.add(self.tab_progress, text="  📊 Order Progress  ")
        self.notebook.add(self.tab_inv, text="  📦 Inventory  ")
        self.notebook.add(self.tab_daily, text="  ✅ Production Log  ")
        self.notebook.add(self.tab_mach, text="  ⚙️ Machine Status  ")
        
        # Build Functions
        self.build_dashboard_tab() # NEW
        self.build_prod_tab()
        self.build_sched_tab()
        self.build_progress_tab()
        self.build_inv_tab()
        self.build_daily_tab()
        self.build_mach_tab()

    # ==========================================
    # DASHBOARD TAB 
    # ==========================================
    def build_dashboard_tab(self):
        frame = self.tab_dash
        
        # --- TOP ROW: KPI CARDS ---
        kpi_frame = tk.Frame(frame)
        kpi_frame.pack(fill="x", pady=15, padx=10)
        
        # We create placeholders for the values, we will update them in 'refresh_dashboard'
        self.lbl_yesterday = self.create_kpi_card(kpi_frame, "Yesterday's Output", 0)
        self.lbl_week = self.create_kpi_card(kpi_frame, "This Week's Output", 1)
        self.lbl_month = self.create_kpi_card(kpi_frame, "This Month's Output", 2)
        self.lbl_target = self.create_kpi_card(kpi_frame, "Today's Target", 3)
        
        # Refresh Button
        ttk.Button(kpi_frame, text="🔄 Refresh Dashboard", command=self.refresh_dashboard).grid(row=0, column=4, padx=20, sticky="ns")

        # --- MIDDLE ROW: SPLIT VIEW ---
        # Left: Today's Schedule | Right: Upcoming Queue
        split_frame = tk.Frame(frame)
        split_frame.pack(fill="both", expand=True, padx=10, pady=5)
        
        # LEFT: TODAY'S SCHEDULE
        left_pane = ttk.LabelFrame(split_frame, text="📅 Today's Schedule", padding=10)
        left_pane.pack(side="left", fill="both", expand=True, padx=(0, 5))
        
        cols_today = ("Machine", "Job", "Client", "Hours")
        self.tree_dash_today = ttk.Treeview(left_pane, columns=cols_today, show='headings', height=8)
        for c in cols_today: 
            self.tree_dash_today.heading(c, text=c)
            self.tree_dash_today.column(c, width=80)
        self.tree_dash_today.pack(fill="both", expand=True)

        # RIGHT: UPCOMING QUEUE
        right_pane = ttk.LabelFrame(split_frame, text="🔜 Upcoming Job Queue", padding=10)
        right_pane.pack(side="right", fill="both", expand=True, padx=(5, 0))
        
        cols_queue = ("Start", "Job", "Client", "Product", "Status")
        self.tree_dash_queue = ttk.Treeview(right_pane, columns=cols_queue, show='headings', height=8)
        for c in cols_queue: 
            self.tree_dash_queue.heading(c, text=c)
            w = 150 if c == "Product" else 80
            self.tree_dash_queue.column(c, width=w)
        self.tree_dash_queue.pack(fill="both", expand=True)

        # Initial Load
        self.refresh_dashboard()

    def create_kpi_card(self, parent, title, col_idx):
        card = ttk.Frame(parent, style="KPI.TFrame", padding=15)
        card.grid(row=0, column=col_idx, padx=10, sticky="ew")
        parent.columnconfigure(col_idx, weight=1)
        
        ttk.Label(card, text=title, style="KPITitle.TLabel").pack(anchor="w")
        val_label = ttk.Label(card, text="0 kg", style="KPIValue.TLabel")
        val_label.pack(anchor="w", pady=(5, 0))
        return val_label

    def refresh_dashboard(self):
        # 1. Update KPI Cards
        stats = logic.get_dashboard_stats()
        self.lbl_yesterday.config(text=f"{int(stats['yesterday'])} kg")
        self.lbl_week.config(text=f"{int(stats['week']):,} kg")
        self.lbl_month.config(text=f"{int(stats['month']):,} kg")
        
        # 2. Update Lists (requires running Scheduler)
        schedule = logic.generate_smart_schedule()
        
        # Calculate Daily Target based on schedule
        todays_target = logic.get_todays_target(schedule)
        self.lbl_target.config(text=f"{int(todays_target):,} kg")

        # Clear Trees
        for i in self.tree_dash_today.get_children(): self.tree_dash_today.delete(i)
        for i in self.tree_dash_queue.get_children(): self.tree_dash_queue.delete(i)
        
        today_str = date.today().strftime("%a") # e.g. "Mon"
        
        for row in schedule:
            if row['machine'] == "UNASSIGNED": continue
            
            # --- Populate "Today's Schedule" ---
            # If the job starts today or is running today. 
            # Simplified: Matches day string (Mon/Tue etc)
            if today_str in row['start']:
                self.tree_dash_today.insert("", "end", values=(
                    row['machine'], row['job'], row['client'], f"{row['hours']} hr"
                ))
            
            # --- Populate "Upcoming Queue" ---
            # Show everything in chronological order
            # Tag status for color
            tags = ()
            if "LATE" in row['status']: tags = ('late',)
            elif "On Time" in row['status']: tags = ('ontime',)
            
            self.tree_dash_queue.insert("", "end", values=(
                row['start'], row['job'], row['client'], 
                # Need to fetch product name from DB as schedule dict doesn't have it by default
                self.get_product_name(row['job']), 
                row['status']
            ), tags=tags)
            
        # Coloring for Queue
        self.tree_dash_queue.tag_configure('late', foreground='#d35400')
        self.tree_dash_queue.tag_configure('ontime', foreground='green')

    def get_product_name(self, job_id):
        # Helper to look up product name efficiently
        for j in database.JOBS:
            if j.job_id == job_id: return j.product
        return "Unknown"

    # ==========================================
    # ORDER PROGRESS
    # ==========================================
    def build_progress_tab(self):
        frame = self.tab_progress
        
        # Toolbar
        toolbar = tk.Frame(frame, pady=10)
        toolbar.pack(fill="x", padx=10)
        ttk.Button(toolbar, text="🔄 Refresh Status", command=self.refresh_progress_tab).pack(side="right")
        
        # Scrollable Canvas
        canvas = tk.Canvas(frame)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        self.prog_scroll_frame = ttk.Frame(canvas)

        self.prog_scroll_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=self.prog_scroll_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        self.refresh_progress_tab()

    def refresh_progress_tab(self):
        # Clear existing cards
        for widget in self.prog_scroll_frame.winfo_children():
            widget.destroy()
            
        # Loop through ALL jobs (Active ones first)
        active_jobs = [j for j in database.JOBS if j.status != "Completed"]
        completed_jobs = [j for j in database.JOBS if j.status == "Completed"]
        
        # Helper to draw a card
        def draw_card(job):
            data = logic.get_job_progress(job.job_id)
            stages = data['stages']
            
            # Card Container
            card = ttk.LabelFrame(self.prog_scroll_frame, text=f" {job.job_id} | {job.client} ", padding=15)
            card.pack(fill="x", padx=20, pady=10)
            
            # Header Info
            header = tk.Frame(card)
            header.pack(fill="x", pady=(0, 10))
            
            status_color = "green" if job.status == "Completed" else "blue"
            tk.Label(header, text=f"Product: {job.product}", font=("Arial", 10, "bold")).pack(side="left")
            tk.Label(header, text=f"Target: {job.weight}kg", font=("Arial", 10)).pack(side="left", padx=20)
            tk.Label(header, text=f"[{job.status}]", fg=status_color, font=("Arial", 10, "bold")).pack(side="right")

            # Progress Bars Container
            bars_frame = tk.Frame(card)
            bars_frame.pack(fill="x")
            
            stage_list = ["Extrusion", "Printing", "Cutting", "Packaging"]
            
            for i, stage_name in enumerate(stage_list):
                info = stages.get(stage_name, {'percent': 0, 'current': 0})
                
                # Column Layout
                f = tk.Frame(bars_frame)
                f.grid(row=0, column=i, sticky="ew", padx=10)
                bars_frame.columnconfigure(i, weight=1)
                
                # Label: "Extrusion: 500/1000kg"
                lbl_txt = f"{stage_name}\n{int(info['current'])} kg"
                tk.Label(f, text=lbl_txt, font=("Arial", 9), anchor="w").pack(fill="x")
                
                # Bar
                bar = ttk.Progressbar(f, orient="horizontal", length=100, mode="determinate")
                bar['value'] = info['percent']
                bar.pack(fill="x", pady=5)
                
                # Percent Text
                tk.Label(f, text=f"{int(info['raw_percent'])}%", font=("Arial", 8)).pack(anchor="e")

        # Draw Active Jobs
        if active_jobs:
            tk.Label(self.prog_scroll_frame, text="Active Orders", font=("Arial", 12, "bold", "underline"), pady=10).pack(anchor="w", padx=20)
            for j in active_jobs: draw_card(j)
            
        # Draw Completed Jobs (Collapsible or just listed at bottom)
        if completed_jobs:
            tk.Label(self.prog_scroll_frame, text="Completed Orders", font=("Arial", 12, "bold", "underline"), pady=10).pack(anchor="w", padx=20)
            for j in completed_jobs: draw_card(j)

    # ==========================================
    # TAB 1: JOB ENTRY
    # ==========================================
    def build_prod_tab(self):
        frame = self.tab_prod
        
        # Input Panel
        panel = ttk.LabelFrame(frame, text="New Job Order", padding=15)
        panel.pack(side="left", fill="y", padx=10, pady=10)
        
        self.entry_jid = self.create_input(panel, "Job ID:", 0)
        self.entry_cli = self.create_input(panel, "Client:", 1)
        self.entry_wgt = self.create_input(panel, "Weight (kg):", 2)
        self.entry_wid = self.create_input(panel, "Width (mm):", 3)
        self.entry_thk = self.create_input(panel, "Thick (mm):", 4)
        
        ttk.Label(panel, text="Recipe:").grid(row=10, column=0, sticky="w")
        self.combo_rcp = ttk.Combobox(panel, values=list(database.RECIPES.keys()), state="readonly")
        self.combo_rcp.grid(row=11, column=0, pady=5)
        
        self.entry_due = self.create_input(panel, "Due Date (YYYY-MM-DD):", 6)
        self.entry_due.insert(0, datetime.now().strftime("%Y-%m-%d"))

        ttk.Button(panel, text="Add Job", command=self.add_job_action).grid(row=14, column=0, sticky="ew", pady=15)
        ttk.Button(panel, text="Delete Selected", command=self.del_job_action).grid(row=15, column=0, sticky="ew")

        # Job Table
        cols = ("ID", "Client", "Weight", "W (mm)", "T (mm)", "Recipe", "Due")
        self.tree_jobs = ttk.Treeview(frame, columns=cols, show='headings')
        for c in cols: 
            self.tree_jobs.heading(c, text=c)
            self.tree_jobs.column(c, width=80)
        
        self.tree_jobs.pack(fill="both", expand=True, padx=10, pady=10)
        
        self.refresh_job_list()

    def create_input(self, parent, label, idx):
        ttk.Label(parent, text=label).grid(row=idx*2, column=0, sticky="w")
        entry = ttk.Entry(parent, width=25)
        entry.grid(row=idx*2+1, column=0, pady=2)
        return entry

    # ==========================================
    # TAB 2: SMART SCHEDULE
    # ==========================================
    def build_sched_tab(self):
        frame = self.tab_sched
        
        # Toolbar
        toolbar = tk.Frame(frame, pady=10)
        toolbar.pack(fill="x", padx=10)
        
        ttk.Button(toolbar, text="🔄 Run Optimization Algorithm", command=self.run_scheduler).pack(side="left")
        
        # Legend (Using tk.Label for color support)
        legend_frame = tk.Frame(toolbar)
        legend_frame.pack(side="right")
        tk.Label(legend_frame, text="■ Late", fg="#d35400").pack(side="left", padx=5)
        tk.Label(legend_frame, text="■ Impossible (Size/Mat)", fg="red").pack(side="left", padx=5)
        tk.Label(legend_frame, text="■ On Time", fg="green").pack(side="left", padx=5)

        # Schedule Table
        cols = ("Machine", "Job ID", "Client", "Start Time", "Est. Finish", "Status", "Note")
        self.tree_sched = ttk.Treeview(frame, columns=cols, show='headings', height=20)
        
        for c in cols: 
            self.tree_sched.heading(c, text=c)
            w = 200 if c == "Note" else 100
            self.tree_sched.column(c, width=w)
        
        self.tree_sched.pack(fill="both", expand=True, padx=10, pady=10)
        
        # Tags for Coloring
        self.tree_sched.tag_configure('impossible', background='#f8d7da', foreground='red') 
        self.tree_sched.tag_configure('late', foreground='#d35400') # Burnt Orange
        self.tree_sched.tag_configure('ontime', foreground='green')

    # ==========================================
    # TAB 3: INVENTORY
    # ==========================================
    def build_inv_tab(self):
        frame = self.tab_inv
        toolbar = tk.Frame(frame, pady=10)
        toolbar.pack(fill="x", padx=10)
        
        ttk.Button(toolbar, text="Refresh", command=self.refresh_inv).pack(side="left")
        ttk.Button(toolbar, text="Restock Material", command=self.restock_action).pack(side="right")
        
        cols = ("Material", "Stock (kg)", "Allocated (kg)", "Available (kg)", "Status")
        self.tree_inv = ttk.Treeview(frame, columns=cols, show='headings')
        for c in cols: self.tree_inv.heading(c, text=c)
        self.tree_inv.pack(fill="both", expand=True, padx=10)
        
        self.tree_inv.tag_configure('CRITICAL', background='#f8d7da')
        self.tree_inv.tag_configure('LOW', background='#fff3cd')
        
        self.refresh_inv()

    # ==========================================
    # UPDATE TAB 4: PRODUCTION LOG
    # ==========================================
    def build_daily_tab(self):
        frame = self.tab_daily
        
        # Input Panel
        panel = ttk.LabelFrame(frame, text="Record Daily Output", padding=15)
        panel.pack(side="left", fill="y", padx=10, pady=10)
        
        # 1. Job Select
        ttk.Label(panel, text="Select Job:").grid(row=0, column=0, sticky="w")
        self.combo_log_job = ttk.Combobox(panel, width=25)
        self.combo_log_job.grid(row=1, column=0, pady=5)
        self.combo_log_job.bind("<Button-1>", self.refresh_job_dropdown)
        
        # 2. Stage Select (NEW)
        ttk.Label(panel, text="Production Stage:").grid(row=2, column=0, sticky="w", pady=(10,0))
        self.combo_log_stage = ttk.Combobox(panel, width=25, state="readonly", 
                                          values=["Extrusion", "Printing", "Cutting", "Packaging"])
        self.combo_log_stage.current(0) # Default to Extrusion
        self.combo_log_stage.grid(row=3, column=0, pady=5)

        # 3. Date
        ttk.Label(panel, text="Date (YYYY-MM-DD):").grid(row=4, column=0, sticky="w", pady=(10,0))
        self.entry_log_date = ttk.Entry(panel, width=28)
        self.entry_log_date.insert(0, datetime.now().strftime("%Y-%m-%d"))
        self.entry_log_date.grid(row=5, column=0, pady=5)
        
        # 4. Output
        ttk.Label(panel, text="✅ Good Output (kg):").grid(row=6, column=0, sticky="w")
        self.entry_log_out = ttk.Entry(panel, width=28)
        self.entry_log_out.grid(row=7, column=0, pady=5)

        # 5. Waste
        ttk.Label(panel, text="❌ Wastage (kg):").grid(row=8, column=0, sticky="w", pady=(10,0))
        self.entry_log_waste = ttk.Entry(panel, width=28)
        self.entry_log_waste.insert(0, "0")
        self.entry_log_waste.grid(row=9, column=0, pady=5)
        
        btn = ttk.Button(panel, text="💾 Confirm Production", command=self.submit_log_action)
        btn.grid(row=10, column=0, sticky="ew", pady=20)
        
        # History Table
        right_panel = ttk.Frame(frame)
        right_panel.pack(side="right", fill="both", expand=True, padx=10, pady=10)
        
        cols = ("Log ID", "Date", "Job ID", "Stage", "Output", "Wastage")
        self.tree_log = ttk.Treeview(right_panel, columns=cols, show='headings')
        
        for c in cols: 
            self.tree_log.heading(c, text=c)
            w = 80 if c != "Log ID" else 100
            self.tree_log.column(c, width=w)
            
        self.tree_log.pack(fill="both", expand=True)
        
        self.refresh_log_history()
        self.refresh_job_dropdown(None)

    def refresh_log_history(self):
        for item in self.tree_log.get_children(): self.tree_log.delete(item)
        for log in database.LOGS:
            # We display stage now
            self.tree_log.insert("", "end", values=(
                log.log_id, log.date, log.job_id, log.stage, log.output_kg, log.wastage_kg
            ))

    # ==========================================
    # TAB 5: MACHINE STATUS (Control Panel)
    # ==========================================
    def build_mach_tab(self):
        frame = self.tab_mach
        
        # Scrollable Area
        canvas = tk.Canvas(frame)
        scrollbar = ttk.Scrollbar(frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas)

        scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # Card Grid Generation
        MAX_COLS = 3
        
        for i, machine in enumerate(database.MACHINES):
            row = i // MAX_COLS
            col = i % MAX_COLS
            
            # Use ttk.LabelFrame for padding support
            card = ttk.LabelFrame(scrollable_frame, text=f" {machine.machine_id} - {machine.machine_type} ", padding=10)
            card.grid(row=row, column=col, padx=10, pady=10, sticky="nsew")
            
            # Details
            info_text = f"Max Width: {machine.max_width_mm}mm\nRange: {machine.min_thick}-{machine.max_thick}mm\nMat: {machine.allowed_materials}"
            tk.Label(card, text=info_text, justify="left", fg="#555").pack(anchor="w")
            
            # Status Dropdown
            tk.Label(card, text="Status:").pack(anchor="w", pady=(5,0))
            status_var = tk.StringVar(value=machine.status)
            status_combo = ttk.Combobox(card, textvariable=status_var, 
                                      values=["Running", "Idle", "Maintenance", "Breakdown"], 
                                      state="readonly")
            status_combo.pack(fill="x")
            
            # Initial Style Set
            self.update_card_color(card, machine.status)
            
            # Bind Change
            status_combo.bind("<<ComboboxSelected>>", 
                            lambda event, c=card, v=status_var: self.on_status_change(c, v))

            # Notes
            tk.Label(card, text="Notes:").pack(anchor="w", pady=(5,0))
            note_entry = ttk.Entry(card)
            note_entry.insert(0, machine.notes)
            note_entry.pack(fill="x")
            
            # Save Button
            btn = ttk.Button(card, text="Update Status", 
                           command=lambda m=machine, v=status_var, n=note_entry: self.save_machine_status(m, v, n))
            btn.pack(pady=10, fill="x")

    def update_card_color(self, card_frame, status):
        # Applies the styles defined in __init__
        if status == "Running":
            card_frame.configure(style="Good.TLabelframe")
        elif status in ["Maintenance", "Breakdown"]:
            card_frame.configure(style="Bad.TLabelframe")
        else:
            card_frame.configure(style="Normal.TLabelframe")

    def on_status_change(self, card, var):
        self.update_card_color(card, var.get())

    def save_machine_status(self, machine, status_var, note_entry):
        new_status = status_var.get()
        new_note = note_entry.get()
        if logic.update_machine_status(machine.machine_id, new_status, new_note):
            messagebox.showinfo("Updated", f"{machine.machine_id} status saved.")
        else:
            messagebox.showerror("Error", "Update failed.")

    # ==========================================
    # ACTION HANDLERS
    # ==========================================

    def refresh_job_list(self):
        for item in self.tree_jobs.get_children():
            self.tree_jobs.delete(item)
        for job in database.JOBS:
            self.tree_jobs.insert("", "end", values=(
                job.job_id, job.client, job.weight, job.width_mm, 
                job.thickness_mm, job.recipe_code, job.due_date
            ))

    def refresh_inv(self):
        for i in self.tree_inv.get_children(): self.tree_inv.delete(i)
        report = logic.calculate_material_requirements()
        for mat, data in report.items():
            self.tree_inv.insert("", "end", values=(
                mat, data['stock'], data['needed'], data['available'], data['status']
            ), tags=(data['status'],))

    def refresh_log_history(self):
        for item in self.tree_log.get_children(): self.tree_log.delete(item)
        for log in database.LOGS:
            mat_str = ", ".join([f"{k}: {v}" for k,v in log.materials_consumed.items()])
            self.tree_log.insert("", "end", values=(
                log.log_id, log.date, log.job_id, log.output_kg, log.wastage_kg, mat_str
            ))

    def refresh_job_dropdown(self, event):
        self.combo_log_job['values'] = [j.job_id for j in database.JOBS]

    def add_job_action(self):
        try:
            logic.add_new_job(
                self.entry_jid.get(), self.entry_cli.get(), "Std", 
                self.entry_wgt.get(), self.combo_rcp.get(), self.entry_due.get(),
                self.entry_wid.get(), self.entry_thk.get()
            )
            self.refresh_job_list()
            self.refresh_inv()
            # Clear Form
            self.entry_jid.delete(0, tk.END)
            self.entry_cli.delete(0, tk.END)
            self.entry_wgt.delete(0, tk.END)
            self.entry_wid.delete(0, tk.END)
            self.entry_thk.delete(0, tk.END)
            messagebox.showinfo("Success", "Job Added.")
        except ValueError as e:
            messagebox.showerror("Error", str(e))

    def del_job_action(self):
        sel = self.tree_jobs.selection()
        if sel:
            item = self.tree_jobs.item(sel)
            logic.delete_job_by_id(item['values'][0])
            self.refresh_job_list()
            self.refresh_inv()

    def run_scheduler(self):
        for item in self.tree_sched.get_children(): self.tree_sched.delete(item)
        schedule = logic.generate_smart_schedule()
        for row in schedule:
            tags = ()
            if row['machine'] == "UNASSIGNED": tags = ('impossible',)
            elif "LATE" in row['status']: tags = ('late',)
            else: tags = ('ontime',)
                
            self.tree_sched.insert("", "end", values=(
                row['machine'], row['job'], row['client'], 
                row['start'], row['end'], row['status'], row.get('note', '')
            ), tags=tags)

    def submit_log_action(self):
        try:
            logic.submit_daily_log(
                self.combo_log_job.get(), 
                self.entry_log_date.get(),
                self.entry_log_out.get(), 
                self.entry_log_waste.get(),
                self.combo_log_stage.get() # Pass Stage
            )
            self.refresh_log_history()
            self.refresh_inv()
            self.refresh_progress_tab() # Update visual bars immediately
            
            messagebox.showinfo("Success", "Production Recorded.")
            self.entry_log_out.delete(0, tk.END)
            self.entry_log_waste.delete(0, tk.END)
            self.entry_log_waste.insert(0, "0")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def restock_action(self):
        mat = simpledialog.askstring("Restock", "Material Name:")
        if mat:
            qty = simpledialog.askfloat("Restock", "Quantity (kg):")
            if logic.restock_material(mat, qty):
                self.refresh_inv()
            else:
                messagebox.showerror("Error", "Material not found.")

if __name__ == "__main__":
    app = SGPPlannerApp()
    app.mainloop()