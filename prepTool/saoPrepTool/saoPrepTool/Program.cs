using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Text.RegularExpressions;
using System.Globalization;

namespace saoPrepTool {

    class DisplayValues {
        public string path = Path.GetFullPath(".");
        public List<string> files = new List<string>();
        public string help = "no elp";
        public List<string> autocomplete = new List<string>();

        public DisplayValues() {
            Console.WriteLine("<path>");
            Console.WriteLine("<files>");
            Console.WriteLine("<help>");
            Console.WriteLine("<autocomplete>");
        }

        public void Display(string line = "", bool doClearInput = false) {
            Console.CursorTop = 0;
            ClearCurrentLine();
            Console.WriteLine(path);

            Console.CursorTop = 1;
            ClearCurrentLine();
            Console.WriteLine(StringlistToString(files));

            Console.CursorTop = 2;
            ClearCurrentLine();
            Console.WriteLine(help);

            Console.CursorTop = 3;
            ClearCurrentLine();
            Console.WriteLine(StringlistToString(autocomplete));

            for (int i = 5; i < Console.WindowHeight - 1; i++) {
                Console.CursorTop = i;
                ClearCurrentLine();
            }

            Console.CursorTop = 4;
            Console.CursorLeft = line.Length;
            if (doClearInput) ClearCurrentLine();
            else if (line != "") {
                ClearCurrentLine();
                Console.Write(line);
            }
        }

        private static void ClearCurrentLine() {
            var currentLine = Console.CursorTop;
            Console.SetCursorPosition(0, Console.CursorTop);
            Console.Write(new string(' ', Console.WindowWidth));
            Console.SetCursorPosition(0, currentLine);
        }

        public string StringlistToString(List<string> list) {
            if (list.Count == 0) return "";
            string r = "";
            foreach (var item in list) {
                r += $"{item}\t";
            }
            r = r.Substring(0, r.Length - 1);
            return r;
        }

        public void RefreshFiles() {
            files.Clear();
            foreach (var file in Directory.EnumerateFileSystemEntries(path)) {
                string[] splits = file.Split('\\');
                files.Add(splits[splits.Length - 1]);
            }
        }
    }

    class Program {

        public static string RemoveControlCharacters(string s) {
            string r = "";
            foreach (char c in s) {
                if (!char.IsControl(c)) r += c;
            }
            return r;
        }

        public static string RemoveCharacter(string s, char c) {
            string r = "";
            foreach (char ch in s) {
                if (ch != c) r += ch;
            }
            return r;
        }

        public static int TimeToSeconds(string s) {
            if (char.IsLetter(s[0])) return 0;
            s = RemoveControlCharacters(s);
            if (s.Length > 5 && s.EndsWith(".000")) s = s.Substring(0, s.Length - 4);
            if (s.Length > 5 && s.EndsWith(".00")) s = s.Substring(0, s.Length - 3);
            if (s.Length > 5 && s.StartsWith("00:")) s = s.Substring(3);
            if (s.Length > 5 && s.StartsWith("0:")) s = s.Substring(2);
            if (s.Length > 5 && s.EndsWith(":00")) s = s.Substring(0, s.Length - 3);
            string[] ts = s.Split(':');
            return 60 * int.Parse(ts[0]) + int.Parse(ts[1]);
        }

        public static int IsInListRange(int search, int[] list, int range) {
            foreach (int item in list) {
                int diff = item - search;
                if (diff < 0) diff *= -1;
                if (diff <= range) {
                    return search < item ? -1 : 1;
                }
            }
            return 0;
        }

        static DisplayValues dv = new DisplayValues();

        static void Main(string[] args) {

            dv.RefreshFiles();

            dv.Display();

            bool running = true;

            string line = "";
            int autoIndex = 0;
            NumberFormatInfo nfi = new NumberFormatInfo();
            nfi.NumberDecimalSeparator = ".";
            while (running) {
                ConsoleKeyInfo input = Console.ReadKey();

                switch (input.Key) {
                    case ConsoleKey.Tab:
                        autoIndex++;
                        if (dv.autocomplete.Count == 0) {
                            autoIndex = 0;
                            var completes = dv.files.Where(f => f.StartsWith(line));
                            if (completes.Count() < 1) break;
                            dv.autocomplete = completes.ToList();
                        }
                        //var completes = dv.files.Where(f => f != line && f.StartsWith(autoBackup));
                        //if (completes.Count() < 1) break;
                        //dv.autocomplete = completes.ToList();
                        //string complete = completes.ElementAtOrDefault(autoIndex % completes.Count());
                        string complete = dv.autocomplete[autoIndex % dv.autocomplete.Count];
                        if (complete != null) {
                            line = complete;
                        }
                        dv.Display(line: line);
                        break;
                    case ConsoleKey.Enter:

                        switch (line) {
                            case "exit":
                                running = false;
                                break;
                            case "..":
                                Match match = Regex.Match(dv.path, @".+(?=\\)");
                                if (match.Success) dv.path = match.Value;
                                if (dv.path.Length < 3) dv.path += Path.DirectorySeparatorChar;
                                dv.RefreshFiles();

                                break;
                            case "crashes":
                                break;
                                dv.help = "Running in chosen directory...";
                                dv.Display();
                                foreach (string fileName in Directory.EnumerateFiles(dv.path)) {
                                    if (fileName.Contains("gigamerge")) {

                                        string[] docLines = File.OpenText(fileName).ReadToEnd().Split('\n');

                                        FileStream fileOut = File.Open($"{dv.path}\\crashes.txt", FileMode.CreateNew);
                                        TextWriter writer = new StreamWriter(fileOut);

                                        bool isNextCrash = true;
                                        foreach (string fLine in docLines) {
                                            string[] cols = RemoveControlCharacters(fLine).Split(',');
                                            if (cols.Length > 44 && cols[46].Length >= 1) {
                                                if (isNextCrash) {
                                                    writer.WriteLine(RemoveCharacter(cols[13], '"'));
                                                    isNextCrash = false;
                                                }
                                            } else {
                                                isNextCrash = true;
                                            }
                                        }

                                        writer.Flush();
                                        writer.Close();
                                        writer.Dispose();
                                        fileOut.Close();
                                    }
                                }
                                dv.help = "Finished";
                                break;
                            case "index":
                                dv.help = "Running in chosen directory...";
                                dv.Display();
                                string root = Directory.GetParent(dv.path).FullName;
                                string allFolders = "";
                                foreach (string subFolder in Directory.EnumerateDirectories(dv.path)) {
                                    allFolders += $"{subFolder.Remove(0, root.Length + 1).Replace("\\", "/")}\n";
                                    string filePath = $"{subFolder}\\index.txt";
                                    if (File.Exists(filePath)) {
                                        File.Delete(filePath);
                                    }
                                    using (FileStream fileOut = File.Open(filePath, FileMode.CreateNew))
                                    using (TextWriter writer = new StreamWriter(fileOut)) {
                                        foreach (string fileName in Directory.EnumerateFiles(subFolder)) {
                                            if (fileName.Contains("index.txt")) continue;
                                            writer.WriteLine(fileName.Remove(0, root.Length + 1).Replace("\\", "/"));
                                        }
                                    }
                                }
                                string filePath2 = $"{dv.path}\\index.txt";
                                if (File.Exists(filePath2)) {
                                    File.Delete(filePath2);
                                }
                                using (FileStream fileOut2 = File.Open(filePath2, FileMode.CreateNew))
                                using (TextWriter writer2 = new StreamWriter(fileOut2)) {
                                    writer2.Write(allFolders);
                                }
                                dv.help = "Finished indexing";
                                break;
                            default:
                                string folder = dv.files.Where(f => f == line).FirstOrDefault();
                                if (!new FileInfo($"{dv.path}\\{folder}").Attributes.HasFlag(FileAttributes.Directory)) break; //is not a directory
                                if (folder != null) {
                                    dv.path += $"\\{folder}";
                                }
                                dv.RefreshFiles();
                                break;
                        }

                        dv.Display(doClearInput: true);

                        line = "";
                        autoIndex = 0;
                        dv.autocomplete.Clear();
                        break;
                    case ConsoleKey.Backspace:
                        if (line.Length > 0) {
                            line = line.Substring(0, line.Length - 1);
                            dv.Display(line: line);
                        }
                        break;
                    case ConsoleKey.Home:
                        if (Directory.Exists("C:\\Users\\Seb\\Documents\\Gits\\MoorigenIO")) dv.path = "C:\\Users\\Seb\\Documents\\Gits\\MoorigenIO";
                        else dv.path = Path.GetFullPath(".");
                        dv.RefreshFiles();
                        dv.Display();
                        break;
                    default:
                        autoIndex = 0;
                        dv.autocomplete.Clear();
                        line += input.KeyChar;
                        dv.Display(line: line);
                        break;
                }
            }
        }
    }
}
