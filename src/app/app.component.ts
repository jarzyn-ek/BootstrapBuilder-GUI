import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from "@angular/material";
import { environment } from "src/environments/environment";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "hello-bb";
  public form: FormGroup;
  public metaTags: FormArray = new FormArray([]);
  public resultTextarea: string = "";
  public headerTypes: string[] = ["static", "dynamic"];
  public availableTags: string[] = [
    "title",
    "description",
    "keywords",
    "og:title",
    "og:description",
    "og:type"
  ];

  @ViewChild("autosize", { static: false }) autosize: CdkTextareaAutosize;

  private snackBarRef: MatSnackBarRef<SimpleSnackBar>;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl("BootstrapBuilder", [Validators.required]),
      header: new FormControl(""),
      headerType: new FormControl("static"),
      footer: new FormControl(),
      metaTags: new FormArray([
        new FormGroup({
          key: new FormControl(this.availableTags[0], [Validators.required]),
          value: new FormControl("BootstrapBuilder", [Validators.required])
        })
      ])
    });

    this.form.valueChanges.subscribe(values => {
      if (this.snackBarRef) {
        this.snackBarRef.closeWithAction();
      }
    });
  }

  public addMetaTag(): void {
    this.metaTags = this.form.get("metaTags") as FormArray;
    this.metaTags.push(this.createMetaTag());
  }

  public removeMetaTag(): void {
    if (this.metaTags.length < 2) {
      return;
    }

    this.metaTags = this.form.get("metaTags") as FormArray;
    this.metaTags.removeAt(this.metaTags.length - 1);
  }

  createMetaTag() {
    return new FormGroup({
      key: new FormControl("", [Validators.required]),
      value: new FormControl("", [Validators.required])
    });
  }

  submit() {
    if (this.form.invalid) {
      this.snackBarRef = this.snackBar.open("Masz błędy w formularzu!", "", {
        verticalPosition: "bottom",
        horizontalPosition: "left",
        duration: 5000
      });
      return;
    }

    this.http
      .post(
        environment.apiUrl,
        {
          input: JSON.stringify(this.form.value),
          metaTags: this.f.metaTags.value
        },
        {
          responseType: "text"
        }
      )
      .subscribe({
        next: response => {
          this.resultTextarea = response;
          this.autosize.resizeToFitContent(true);
        }
      });
  }

  get f() {
    return this.form.controls;
  }
}
