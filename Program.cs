using System;

class RowEchilonForm
{
    public static void ReducedRowEchelonForm(double[,] matrix)
    {
        int rows = matrix.GetLength(0);  // عدد الصفوف في المصفوفة
        int cols = matrix.GetLength(1);  // عدد الأعمدة في المصفوفة

        // لو عدد المتغيرات أكبر من عدد المعادلات
        if (cols - 1 > rows)
        {
            Console.WriteLine("Infinite solutions");
            // هيديك مثال لقيم المتغيرات
            for (int i = 0; i < rows; i++)
            {
                Console.WriteLine($"x{i + 1} = {matrix[i, cols - 1]} (Example value for infinite solutions)");
            }
            return;
        }

        // لو عدد المعادلات أكبر من عدد المتغيرات
        if (rows > cols - 1)
        {
            Console.WriteLine("No solutions");
            return;
        }

        // نبدأ نمشي على الصفوف والأعمدة في المصفوفة
        for (int i = 0; i < Math.Min(rows, cols); i++)
        {
            int leadingOne = i;

            // ندور على الصف اللي فيه أكبر قيمة في العمود ده
            for (int j = i + 1; j < rows; j++)
            {
                if (Math.Abs(matrix[j, i]) > Math.Abs(matrix[leadingOne, i]))
                {
                    leadingOne = j;
                }
            }

            // لو مفيش قيمة غير صفرية، نكمل للصف اللي بعده
            if (matrix[leadingOne, i] == 0)
            {
                continue;
            }

            // نبدل الصف الحالي مع الصف اللي لقيناه فيه أكبر قيمة
            SwapRows(ref matrix, i, leadingOne);

            // نقسم الصف ده عشان نخلي أول عنصر يساوي 1
            double leadingOneValue = matrix[i, i];
            for (int j = i; j < cols; j++)
            {
                matrix[i, j] /= leadingOneValue;
            }

            // نعمل 0 فوق وتحت الـ leading 1 في باقي الأعمدة
            for (int j = 0; j < rows; j++)
            {
                if (j != i)
                {
                    double factor = matrix[j, i];
                    for (int k = i; k < cols; k++)
                    {
                        matrix[j, k] -= factor * matrix[i, k];
                    }
                }
            }
        }

        // نشوف لو عندنا حل واحد مميز ولا لا
        if (IsConsistentAndUnique(matrix))
        {
            Console.WriteLine("Unique solution:");
            PrintSolution(matrix);  // نطبع قيم المتغيرات
        }
        else
        {
            Console.WriteLine("Infinite solutions");
        }
    }

    // دالة لتبديل الصفين في المصفوفة
    private static void SwapRows(ref double[,] matrix, int row1, int row2)
    {
        int cols = matrix.GetLength(1);
        for (int i = 0; i < cols; i++)
        {
            double temp = matrix[row1, i];
            matrix[row1, i] = matrix[row2, i];
            matrix[row2, i] = temp;
        }
    }

    // دالة تشوف لو النظام ممكن يكون ليه حل مميز أو لأ
    private static bool IsConsistentAndUnique(double[,] matrix)
    {
        int rows = matrix.GetLength(0);
        int cols = matrix.GetLength(1);

        for (int i = 0; i < rows; i++)
        {
            bool allZeroes = true;
            for (int j = 0; j < cols - 1; j++)
            {
                if (matrix[i, j] != 0)
                {
                    allZeroes = false;
                    break;
                }
            }
            if (allZeroes && matrix[i, cols - 1] != 0)
            {
                return false;  // لو في صف فيه كله أصفار بس فيه قيمة حرة يبقى مفيش حلول
            }
        }
        return true;
    }

    // دالة تطبع قيم المتغيرات
    private static void PrintSolution(double[,] matrix)
    {
        int rows = matrix.GetLength(0);
        int cols = matrix.GetLength(1);

        for (int i = 0; i < rows; i++)
        {
            Console.WriteLine($"x{i + 1} = {matrix[i, cols - 1]}");
        }
    }

    static void Main(string[] args)
    {
        // البرنامج هيفضل شغال لحد ما المستخدم يوقفه
        while (true)
        {
            Console.WriteLine("Enter the number of variables:");
            int variables = int.Parse(Console.ReadLine());
            Console.WriteLine("Enter the number of equations:");
            int equations = int.Parse(Console.ReadLine());

            // نعمل مصفوفة على قد عدد المعادلات والمتغيرات + 1 (للحدود الحرة)
            double[,] matrix = new double[equations, variables + 1];

            // نسأل المستخدم على قيم المعاملات والحدود الحرة
            for (int i = 0; i < equations; i++)
            {
                for (int j = 0; j < variables; j++)
                {
                    Console.Write($"Enter coefficient for x{j + 1} in equation {i + 1}: ");
                    matrix[i, j] = double.Parse(Console.ReadLine());
                }
                Console.Write($"Enter the constant term for equation {i + 1}: ");
                matrix[i, variables] = double.Parse(Console.ReadLine());
            }

            // نطبق الـ Reduced Row Echelon Form
            ReducedRowEchelonForm(matrix);

            // نسأل المستخدم إذا كان عايز يدخل نظام جديد ولا لأ
            Console.WriteLine("Do you want to enter another system? (y/n)");
            string response = Console.ReadLine().ToLower();
            if (response != "y")
            {
                break;  // لو المستخدم قال لأ، نخرج من البرنامج
            }
        }
    }
}
